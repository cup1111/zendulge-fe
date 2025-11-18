// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react';

import { registerBusiness } from '~/api/register';

import BusinessRegistrationFlow from '../components/layout/BusinessRegistrationFlow';
import type {
  BusinessAddress,
  BusinessRegistrationFormData,
  ErrorState,
} from '../types/businessType';

export default function BusinessRegistration() {
  const [sectionStep, setSectionStep] = useState<number>(1);
  const [businessRegistrationFormData, setBusinessRegistrationFormData] =
    useState<BusinessRegistrationFormData>({
      // Business fields
      businessName: {
        isRequired: true,
        value: '',
        defaultValue: 'Business Name',
      },
      businessABN: {
        isRequired: true,
        value: '',
        defaultValue: '12345678901',
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
      selectedCountry: {
        isRequired: true,
        value: 'Australia +61',
        defaultValue: 'Australia +611',
      },
      businessEmail: {
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
      contactPersonSelectedCountry: {
        isRequired: true,
        value: 'Australia +61',
        defaultValue: 'Australia +61',
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
      logo: {
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

  const handleInputChange = (field: string, value: string) => {
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
    setSectionStep(prev => prev + 1);
    setHasChanged(false);
  };

  const prevStep = () => {
    setSectionStep(prev => prev - 1);
    setHasChanged(true);
  };
  const handleSubmit = async () => {
    // Recursively validates all form fields including nested address fields
    // Returns an object with error messages keyed by field path (empty string means no error)
    const validateAll = (formData: BusinessRegistrationFormData, path = '') => {
      const errs: Record<string, string> = {};

      Object.entries(formData).forEach(([key, field]) => {
        // Special handling for confirmPassword - needs password field for comparison
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

        // Build full key path for nested fields (e.g., "businessAddress.street")
        const fullKey = path ? `${path}.${key}` : key;
        // Check if field has a value property (BusinessField structure)
        if (field && typeof field === 'object' && 'value' in field) {
          // Validate required fields
          if (field.isRequired && !field.value) {
            errs[fullKey] = 'This field is required';
            return;
          }

          // Run custom validation function if provided
          if (typeof field.validate === 'function') {
            const validationMsg = field.validate(field.value);
            if (validationMsg) {
              errs[fullKey] = validationMsg;
              return;
            }
          }
          errs[fullKey] = '';
        }
        // Recursively validate nested objects (like businessAddress)
        else if (field && typeof field === 'object') {
          Object.assign(errs, validateAll(field, fullKey));
        }
      });

      return errs;
    };

    const newErrors = validateAll(businessRegistrationFormData);

    setError(newErrors);

    const hasError = Object.values(newErrors).some(msg => msg);
    if (hasError) {
      return;
    }

    // Extracts the actual values from the nested BusinessField structure
    // Transforms the form data structure into a flat payload for API submission
    // Example: { businessName: { value: "My Business", ... } } becomes { businessName: "My Business" }
    type ExtractValues<T> = {
      [K in keyof T]: T[K] extends { value: infer V }
        ? V
        : T[K] extends object
          ? ExtractValues<T[K]>
          : T[K];
    };
    function extractFormValues<T>(formData: T): ExtractValues<T> {
      return Object.fromEntries(
        Object.entries(formData).map(([key, val]) => {
          // Extract value from BusinessField structure
          if (val && typeof val === 'object' && 'value' in val)
            return [key, val.value];
          // Recursively process nested objects
          if (val && typeof val === 'object')
            return [key, extractFormValues(val)];
          // Return primitive values as-is
          return [key, val];
        })
      );
    }
    const data = extractFormValues(businessRegistrationFormData);
    delete data.confirmPassword; // 提交前移除 confirmPassword
    const response = await registerBusiness(data);
    if (response.successful || response.success) {
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
