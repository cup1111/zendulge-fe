// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react';

import { registerBusiness } from '~/api/register';

import BusinessRegistrationFlow from '../components/layout/BusinessRegistrationFlow';
import type {
  BusinessAddress,
  BusinessField,
  BusinessRegistrationFormData,
  ErrorState,
} from '../types/businessType';

export default function BusinessRegistration() {
  const [sectionStep, setsectionStep] = useState<number>(1);
  const [businessRegistrationFormData, setBusinessRegistrationFormData] =
    useState<BusinessRegistrationFormData>({
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
  const [error, setError] = useState<ErrorState>({});
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const handleInputChange = (field: string, value: BusinessField) => {
    setHasChanged(true);
    const updatedField = {
      ...businessRegistrationFormData[field],
      ...{ value },
    };
    setBusinessRegistrationFormData({
      ...businessRegistrationFormData,
      ...{ [field]: updatedField },
    });
    if (businessRegistrationFormData[field].isRequired && !value) {
      setError({ ...error, ...{ [field]: 'This field is required' } });
    } else {
      setError(prev => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { [field]: _, ...rest } = prev as Record<string, string>;
        return rest;
      });
    }
    if (field === 'confirmPassword') {
      if (businessRegistrationFormData[field].validate) {
        setError({
          ...error,
          [field]: businessRegistrationFormData[field].validate(
            value,
            businessRegistrationFormData.password.value
          ),
        });
      }
    } else if (businessRegistrationFormData[field].validate) {
      setError({
        ...error,
        [field]: businessRegistrationFormData[field].validate(value),
      });
    }
  };
  const handleAddressChange = (value: BusinessAddress) => {
    setBusinessRegistrationFormData({
      ...businessRegistrationFormData,
      businessAddress: value,
    });
  };

  const nextStep = () => {
    setsectionStep(prev => prev + 1);
    setHasChanged(false);
  };
  const prevStep = () => {
    setsectionStep(prev => prev - 1);
    setHasChanged(true);
  };
  const handleSubmit = async () => {
    const validateAll = (obj: businessRegistrationFormData, path = '') => {
      const errs: Record<string, string> = {};

      Object.entries(obj).forEach(([key, field]) => {
        if (key === 'confirmPassword') {
          const validationMsg = field.validate(field.value, obj.password.value);
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

    const newErrors = validateAll(businessRegistrationFormData);

    setError(newErrors);

    const hasError = Object.values(newErrors).some(msg => msg);
    if (hasError) {
      console.warn('❌ Validation failed');
      return;
    }

    type ExtractValues<T> = {
      [K in keyof T]: T[K] extends { value: infer V }
        ? V
        : T[K] extends object
          ? ExtractValues<T[K]>
          : T[K];
    };
    function extractValues<T>(obj: T): ExtractValues<T> {
      return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => {
          if (val && typeof val === 'object' && 'value' in val)
            return [key, val.value];
          if (val && typeof val === 'object') return [key, extractValues(val)];
          return [key, val];
        })
      );
    }
    const data = extractValues(businessRegistrationFormData);
    delete data.confirmPassword; // 提交前移除 confirmPassword
    const response = await registerBusiness(data);
    if (response.successful) {
      nextStep();
    }
  };

  return (
    <BusinessRegistrationFlow
      sectionStep={sectionStep}
      businessRegistrationFormData={businessRegistrationFormData}
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
