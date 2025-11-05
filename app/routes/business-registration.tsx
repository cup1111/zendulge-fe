// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react';

import { registerBusiness } from '~/api/register';

import BusinessRegistrationFlow from '../components/layout/BusinessRegistrationFlow';

export default function BusinessRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business fields
    companyName: {
      isRequired: true,
      value: '',
      defaultValue: 'Company Name',
    },
    description: {
      validate: value => {
        if (value.length > 500) {
          return 'Description cannot exceed 500 characters';
        }
        return null;
      },
      value: '',
      defaultValue: 'Description',
    },
    firstName: {
      isRequired: true,
      value: '',
      defaultValue: 'First Name',
    },
    lastName: {
      isRequired: true,
      value: '',
      defaultValue: 'Last Name',
    },
    categories: {
      validate: value => {
        if (value.length < 1) {
          return 'At least one category must be selected';
        }
        return null;
      },
      value: [] as string[],
      defaultValue: [],
    },
    serviceCategory: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    jobTitle: {
      isRequired: true,
      value: '',
      defaultValue: 'Job Title',
    },
    businessAddress: {
      country: {
        isRequired: true,
        value: 'Australia',
        defaultValue: 'Australia',
      },
      streetNumber: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      street: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      suburb: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      city: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      state: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      postcode: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      // fullAddress: {
      //   isRequired: true,
      //   value: '',
      //   defaultValue: '',
      // },
    },
    phone: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    companyEmail: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    contactPersonName: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    contactPersonEmail: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    contactPersonPhone: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    website: {
      isRequired: false,
      value: '',
      defaultValue: '',
    },
    facebook: {
      isRequired: false,
      value: '',
      defaultValue: '',
    },
    twitter: {
      isRequired: false,
      value: '',
      defaultValue: '',
    },
    email: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    password: {
      isRequired: true,
      value: '',
      defaultValue: '',
    },
    confirmPassword: {
      validate: (value, password) => {
        if (value !== password) {
          return 'Passwords do not match';
        }
        return null;
      },
      value: '',
      defaultValue: '',
    },
  });
  const [error, setError] = useState({});
  const [hasChanged, setHasChanged] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setHasChanged(true);
    const updatedField = { ...formData[field], ...{ value } };
    setFormData({ ...formData, ...{ [field]: updatedField } });
    if (formData[field].isRequired && !value) {
      setError({ ...error, ...{ [field]: 'This field is required' } });
    } else {
      setError(prev => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { [field]: _, ...rest } = prev as Record<string, string>;
        return rest;
      });
    }
    if (field === 'confirmPassword') {
      if (formData[field].validate) {
        setError({
          ...error,
          [field]: formData[field].validate(value, formData.password.value),
        });
      }
    } else if (formData[field].validate) {
      setError({ ...error, [field]: formData[field].validate(value) });
    }
  };
  const handleAddressChange = (value: any) => {
    setFormData({ ...formData, businessAddress: value });
  };

  const handleSubmit = async () => {
    const validateAll = (obj: any, path = '') => {
      const errs: Record<string, string> = {};

      Object.entries(obj).forEach(([key, field]) => {
        if (key === 'confirmPassword') {
          const validationMsg = field.validate(
            field.value,
            formData.password.value
          );
          if (validationMsg) {
            errs[key] = validationMsg;
            return;
          }
          errs[key] = '';
          return;
        }

        const fullKey = path ? `${path}.${key}` : key;
        if (field && typeof field === 'object' && 'value' in field) {
          if (field.isRequired && !field.value) {
            errs[fullKey] = 'This field is required';
            return;
          }

          if (typeof field.validate === 'function') {
            const validationMsg = field.validate(field.value);
            if (validationMsg) {
              errs[fullKey] = validationMsg;
              return;
            }
          }
          errs[fullKey] = '';
        } else if (field && typeof field === 'object') {
          Object.assign(errs, validateAll(field, fullKey));
        }
      });

      return errs;
    };

    const newErrors = validateAll(formData);

    setError(newErrors);

    const hasError = Object.values(newErrors).some(msg => msg);
    if (hasError) {
      console.warn('❌ Validation failed');
      return;
    }

    const extractValues = (obj: any): any =>
      Object.fromEntries(
        Object.entries(obj).map(([key, val]) => {
          if (val && typeof val === 'object' && 'value' in val)
            return [key, val.value];
          if (val && typeof val === 'object') return [key, extractValues(val)];
          return [key, val];
        })
      );

    const data = extractValues(formData);
    delete data.confirmPassword; // 提交前移除 confirmPassword
    await registerBusiness(data);
    onNext();
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
    setHasChanged(false);
  };
  const prevStep = () => {
    setStep(prev => prev - 1);
    setHasChanged(true);
  };

  return (
    <BusinessRegistrationFlow
      step={step}
      formData={formData}
      error={error}
      setError={setError}
      onInputChange={handleInputChange}
      onAddressChange={handleAddressChange}
      onSubmit={handleSubmit}
      onNext={nextStep}
      onPrev={prevStep}
      hasChanged={hasChanged}
    />
  );
}
