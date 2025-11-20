// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react';

import { registerBusiness } from '~/api/register';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '~/utils/validationUtils';

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
        // Business name validation: minimum 2 characters for meaningful names,
        // maximum 100 characters to prevent excessively long names
        // This ensures professional business names while maintaining database constraints
        validate: value => {
          if (value.trim().length < 2) {
            return 'Business name must be at least 2 characters';
          }
          if (value.length > 100) {
            return 'Business name cannot exceed 100 characters';
          }
          return null;
        },
        value: '',
        defaultValue: 'Business Name',
      },
      businessABN: {
        isRequired: true,
        // ABN validation: Australian Business Number must be exactly 11 digits
        // ABN is required for tax and business registration purposes in Australia
        // Format can be with or without spaces (e.g., "12345678901" or "12 345 678 901")
        validate: value => {
          const cleanedABN = value.replace(/\s/g, '');
          if (!/^\d{11}$/.test(cleanedABN)) {
            return 'ABN must be exactly 11 digits';
          }
          return null;
        },
        value: '',
        defaultValue: '12345678901',
      },
      description: {
        // Description validation: maximum 500 characters to keep descriptions concise
        // Optional field but if provided, should be within reasonable length for database storage
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
        // First name validation: minimum 1 character, maximum 50 characters
        // Prevents empty strings and ensures reasonable length for database storage
        // Allows for international names while maintaining data quality
        validate: value => {
          if (value.trim().length < 1) {
            return 'First name is required';
          }
          if (value.length > 50) {
            return 'First name cannot exceed 50 characters';
          }
          // Allow letters, spaces, hyphens, and apostrophes for international names
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            return 'First name can only contain letters, spaces, hyphens, and apostrophes';
          }
          return null;
        },
        value: '',
        defaultValue: 'First Name',
      },
      lastName: {
        isRequired: true,
        // Last name validation: minimum 1 character, maximum 50 characters
        // Prevents empty strings and ensures reasonable length for database storage
        // Allows for international names while maintaining data quality
        validate: value => {
          if (value.trim().length < 1) {
            return 'Last name is required';
          }
          if (value.length > 50) {
            return 'Last name cannot exceed 50 characters';
          }
          // Allow letters, spaces, hyphens, and apostrophes for international names
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
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
        // Job title validation: minimum 2 characters, maximum 100 characters
        // Ensures meaningful job titles while allowing for various professional titles
        // Important for business registration to identify the contact person's role
        validate: value => {
          if (value.trim().length < 2) {
            return 'Job title must be at least 2 characters';
          }
          if (value.length > 100) {
            return 'Job title cannot exceed 100 characters';
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
          // Street number validation: allows numbers and common suffixes (e.g., "123A", "45/67")
          // Important for accurate address formatting and delivery purposes
          validate: value => {
            // In character class [], forward slash doesn't need escaping
            if (!/^[\d/A-Za-z-]+$/.test(value.trim())) {
              return 'Street number can only contain numbers, letters, slashes, and hyphens';
            }
            if (value.trim().length > 20) {
              return 'Street number cannot exceed 20 characters';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        street: {
          isRequired: true,
          // Street name validation: minimum 2 characters, allows letters, numbers, and common address terms
          // Ensures valid street names for accurate address formatting
          validate: value => {
            if (value.trim().length < 2) {
              return 'Street name must be at least 2 characters';
            }
            if (value.length > 100) {
              return 'Street name cannot exceed 100 characters';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        suburb: {
          isRequired: true,
          // Suburb validation: minimum 2 characters, maximum 50 characters
          // Important for accurate address identification in Australia
          validate: value => {
            if (value.trim().length < 2) {
              return 'Suburb must be at least 2 characters';
            }
            if (value.length > 50) {
              return 'Suburb cannot exceed 50 characters';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
        city: {
          isRequired: true,
          // City validation: minimum 2 characters, maximum 50 characters
          // Ensures valid city names for accurate address formatting
          validate: value => {
            if (value.trim().length < 2) {
              return 'City must be at least 2 characters';
            }
            if (value.length > 50) {
              return 'City cannot exceed 50 characters';
            }
            return null;
          },
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
          // Postcode validation: Australian postcodes are exactly 4 digits
          // Critical for accurate mail delivery and address verification
          validate: value => {
            if (!/^\d{4}$/.test(value.trim())) {
              return 'Australian postcode must be exactly 4 digits';
            }
            return null;
          },
          value: '',
          defaultValue: '',
        },
      },
      phone: {
        isRequired: true,
        // Phone validation: minimum 8 digits (excluding country code)
        // Ensures valid phone numbers for business contact purposes
        // Format includes country code prefix, so we validate the full number length
        validate: value => {
          // In character class [], parentheses and + don't need escaping
          // Dash (-) should be at the start or end to avoid escaping
          const cleanedPhone = value.replace(/[-\s()+]/g, '');
          if (cleanedPhone.length < 8) {
            return 'Phone number must be at least 8 digits';
          }
          if (!/^\d+$/.test(cleanedPhone)) {
            return 'Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      selectedCountry: {
        isRequired: true,
        value: 'AU',
        defaultValue: 'AU',
      },
      businessEmail: {
        isRequired: true,
        validate: value => validateEmail(value) ?? null,
        value: '',
        defaultValue: '',
      },
      contactPersonName: {
        isRequired: true,
        // Contact person name validation: minimum 2 characters, maximum 100 characters
        // Allows for full names including middle names or titles
        // Important for identifying the business contact person
        validate: value => {
          if (value.trim().length < 2) {
            return 'Contact person name must be at least 2 characters';
          }
          if (value.length > 100) {
            return 'Contact person name cannot exceed 100 characters';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      contactPersonEmail: {
        isRequired: true,
        validate: value => validateEmail(value) ?? null,
        value: '',
        defaultValue: '',
      },
      contactPersonPhone: {
        isRequired: true,
        // Contact person phone validation: minimum 8 digits (excluding country code)
        // Ensures valid phone numbers for account management and communication
        validate: value => {
          // In character class [], parentheses and + don't need escaping
          // Dash (-) should be at the start or end to avoid escaping
          const cleanedPhone = value.replace(/[-\s()+]/g, '');
          if (cleanedPhone.length < 8) {
            return 'Phone number must be at least 8 digits';
          }
          if (!/^\d+$/.test(cleanedPhone)) {
            return 'Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign';
          }
          return null;
        },
        value: '',
        defaultValue: '',
      },
      contactPersonSelectedCountry: {
        isRequired: true,
        value: 'AU',
        defaultValue: 'AU',
      },
      website: {
        isRequired: false,
        // Website URL validation: must be a valid URL format if provided
        // Optional field but if provided, should be a valid URL for business credibility
        // Allows http, https protocols for business websites
        validate: value => {
          if (!value.trim()) {
            return null; // Optional field, empty is valid
          }
          try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
              return 'Website URL must start with http:// or https://';
            }
            return null;
          } catch {
            return 'Please enter a valid website URL (e.g., https://example.com)';
          }
        },
        value: '',
        defaultValue: '',
      },
      facebook: {
        isRequired: false,
        // Facebook URL validation: must be a valid Facebook URL if provided
        // Optional field but if provided, should be a valid Facebook page/profile URL
        // Helps customers find the business on social media
        validate: value => {
          if (!value.trim()) {
            return null; // Optional field, empty is valid
          }
          try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
              return 'Facebook URL must start with http:// or https://';
            }
            // Check if it's a Facebook domain
            if (
              !url.hostname.includes('facebook.com') &&
              !url.hostname.includes('fb.com')
            ) {
              return 'Please enter a valid Facebook URL';
            }
            return null;
          } catch {
            return 'Please enter a valid Facebook URL (e.g., https://facebook.com/yourpage)';
          }
        },
        value: '',
        defaultValue: '',
      },
      twitter: {
        isRequired: false,
        // Twitter URL validation: must be a valid Twitter/X URL if provided
        // Optional field but if provided, should be a valid Twitter profile URL
        // Helps customers find the business on social media
        validate: value => {
          if (!value.trim()) {
            return null; // Optional field, empty is valid
          }
          try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
              return 'Twitter URL must start with http:// or https://';
            }
            // Check if it's a Twitter/X domain
            if (
              !url.hostname.includes('twitter.com') &&
              !url.hostname.includes('x.com')
            ) {
              return 'Please enter a valid Twitter URL';
            }
            return null;
          } catch {
            return 'Please enter a valid Twitter URL (e.g., https://twitter.com/yourhandle)';
          }
        },
        value: '',
        defaultValue: '',
      },
      companyLogo: {
        isRequired: false,
        value: '',
        defaultValue: '',
      },
      email: {
        isRequired: true,
        validate: value => validateEmail(value) ?? null,
        value: '',
        defaultValue: '',
      },
      password: {
        isRequired: true,
        validate: value => validatePassword(value) ?? null,
        value: '',
        defaultValue: '',
      },
      confirmPassword: {
        validate: (value, password) =>
          validateConfirmPassword(value, password) ?? null,
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
