// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react';

import { registerBusiness } from '~/api/register';
import { validateEmail } from '~/utils/validationUtils';

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
        validate: value => validateEmail(value) ?? null,
        value: '',
        defaultValue: '',
      },
      contactPersonName: {
        isRequired: true,
        value: '',
        defaultValue: '',
      },
      contactPersonEmail: {
        validate: value => validateEmail(value) ?? null,
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
      companyLogo: {
        isRequired: false,
        value: '',
        defaultValue: '',
      },
      email: {
        validate: value => validateEmail(value) ?? null,
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

  const validateField = (
    field: string,
    value: string | string[],
    formData: BusinessRegistrationFormData
  ): string | undefined => {
    const currentField = formData[field as keyof BusinessRegistrationFormData];

    // Skip validation if field doesn't exist in form data
    if (
      !currentField ||
      typeof currentField !== 'object' ||
      !('value' in currentField)
    ) {
      return undefined;
    }

    // Check required field validation
    // For arrays, check if array is empty
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
    if (currentField.isRequired && isEmpty) {
      return 'This field is required';
    }

    // Run custom validation if provided
    if (currentField.validate) {
      const isConfirmPassword = field === 'confirmPassword';
      const validationMsg = isConfirmPassword
        ? currentField.validate(value as string, formData.password.value)
        : currentField.validate(value);

      return validationMsg ?? undefined;
    }

    return undefined;
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setHasChanged(true);

    // Get current field configuration
    const currentField =
      businessRegistrationFormData[field as keyof BusinessRegistrationFormData];

    // Update form data
    const updatedField = {
      ...currentField,
      value,
    };
    const updatedFormData = {
      ...businessRegistrationFormData,
      [field]: updatedField,
    };
    setBusinessRegistrationFormData(updatedFormData);

    // Validate field with updated form data to ensure synchronization
    // Pass updated formData so confirmPassword validation can access latest password value
    const errorMsg = validateField(field, value, updatedFormData);

    if (errorMsg) {
      setError({ ...error, ...{ [field]: errorMsg } });
    } else {
      // Clear error if validation passes
      setError(prev => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { [field]: _, ...rest } = prev as Record<string, string>;
        return rest;
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
    // Returns an ErrorState object with nested structure for businessAddress
    const validateAll = (
      formData: BusinessRegistrationFormData
    ): ErrorState => {
      const errs: Partial<ErrorState> = {};

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

        // Special handling for businessAddress - create nested structure
        if (key === 'businessAddress') {
          const addressErrors: Partial<Record<keyof BusinessAddress, string>> =
            {};
          let hasAddressError = false;

          Object.entries(field).forEach(([addrKey, addrField]) => {
            if (
              addrField &&
              typeof addrField === 'object' &&
              'value' in addrField
            ) {
              // Validate required fields
              if (addrField.isRequired && !addrField.value) {
                addressErrors[addrKey as keyof BusinessAddress] =
                  'This field is required';
                hasAddressError = true;
                return;
              }

              // Run custom validation function if provided
              if (typeof addrField.validate === 'function') {
                const validationMsg = addrField.validate(addrField.value);
                if (validationMsg) {
                  addressErrors[addrKey as keyof BusinessAddress] =
                    validationMsg;
                  hasAddressError = true;
                }
              }
            }
          });

          // Only set businessAddress errors if there are actual errors
          if (hasAddressError) {
            errs.businessAddress = addressErrors as Record<
              keyof BusinessAddress,
              string
            >;
          }
          return;
        }

        // Check if field has a value property (BusinessField structure)
        if (field && typeof field === 'object' && 'value' in field) {
          // Validate required fields
          if (field.isRequired && !field.value) {
            errs[key as keyof BusinessRegistrationFormData] =
              'This field is required';
            return;
          }

          // Run custom validation function if provided
          if (typeof field.validate === 'function') {
            const validationMsg = field.validate(field.value);
            if (validationMsg) {
              errs[key as keyof BusinessRegistrationFormData] = validationMsg;
              return;
            }
          }
          errs[key as keyof BusinessRegistrationFormData] = '';
        }
      });

      return errs as ErrorState;
    };

    const newErrors = validateAll(businessRegistrationFormData);

    setError(newErrors);

    // Check for errors including nested address errors
    const hasError =
      Object.values(newErrors).some(msg => {
        if (typeof msg === 'string') {
          return msg && msg !== '';
        }
        if (msg && typeof msg === 'object') {
          // Check nested address errors
          return Object.values(msg).some(
            nestedMsg => nestedMsg && nestedMsg !== ''
          );
        }
        return false;
      }) ||
      (newErrors.businessAddress &&
        Object.values(newErrors.businessAddress).some(
          msg => msg && msg !== ''
        ));
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
