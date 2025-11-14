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
      companyName: {
        isRequired: true,
        validate: (value: string) => {
          if (!value || value.trim().length < 2 || value.length > 100) {
            return 'Company name must be between 2 and 100 characters';
          }
          return null;
        },
        value: '',
        defaultValue: 'Company Name',
      },
      companyABN: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^\d{11}$/.test(value)) {
            return 'ABN must be 11 digits';
          }
          return null;
        },
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
        validate: (value: string) => {
          if (!/^[a-zA-Z\s'-]{2,50}$/.test(value)) {
            return 'First name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
          }
          return null;
        },
        value: '',
        defaultValue: 'First Name',
      },
      lastName: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^[a-zA-Z\s'-]{2,50}$/.test(value)) {
            return 'Last name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
          }
          return null;
        },
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
        validate: (value: string) => {
          if (!value || value.trim().length < 2 || value.length > 50) {
            return 'Job title must be between 2 and 50 characters';
          }
          return null;
        },
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
          validate: (value: string) => {
            if (!/^[0-9A-Za-z\s-]{1,20}$/.test(value)) {
              return 'Street number format is invalid';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        street: {
          isRequired: true,
          validate: (value: string) => {
            if (!value || value.trim().length < 2 || value.length > 100) {
              return 'Street name must be between 2 and 100 characters';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        suburb: {
          isRequired: true,
          validate: (value: string) => {
            if (!/^[a-zA-Z\s'-]{2,50}$/.test(value)) {
              return 'Suburb name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        city: {
          isRequired: true,
          validate: (value: string) => {
            if (!/^[a-zA-Z\s'-]{2,50}$/.test(value)) {
              return 'City name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        state: {
          isRequired: true,
          validate: (value: string) => {
            if (!/^[a-zA-Z\s'-]{2,50}$/.test(value)) {
              return 'State name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        postcode: {
          isRequired: true,
          validate: (value: string) => {
            if (!/^\d{4}$/.test(value)) {
              return 'Postcode must be 4 digits';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
      },
      phone: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
            return 'Please enter a valid phone number';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      selectedCountry: {
        isRequired: true,
        value: 'Australia +61',
        defaultValue: 'Australia +611',
      },
      companyEmail: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      contactPersonName: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^[a-zA-Z\s'-]{2,50}$/.test(value)) {
            return 'Contact person name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      contactPersonEmail: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      contactPersonPhone: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
            return 'Please enter a valid phone number';
          }
          return null;
        },
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
        validate: (value: string) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return 'Please enter a valid URL (must start with http:// or https://)';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      facebook: {
        isRequired: false,
        validate: (value: string) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return 'Please enter a valid URL (must start with http:// or https://)';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      twitter: {
        isRequired: false,
        validate: (value: string) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return 'Please enter a valid URL (must start with http:// or https://)';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      email: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      password: {
        isRequired: true,
        validate: (value: string) => {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
            return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
          }
          return null;
        },
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
    // Example: { companyName: { value: "My Company", ... } } becomes { companyName: "My Company" }
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
