// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState } from 'react';

import { registerBusiness } from '~/api/register';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '~/utils/validationUtils';

import BusinessRegistrationFlow from '../components/layout/BusinessRegistrationFlow';
import type {
  BusinessRegistrationFormData,
  ErrorState,
  FormDataRecord,
  Step1FormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  Step5FormData,
  Step6FormData,
  Step7FormData,
  Step8FormData,
} from '../types/businessType';

// Initialize form data for each step
const createStep1Data = (): Step1FormData => ({
  businessName: {
    isRequired: true,
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
  companyLogo: {
    isRequired: false,
    value: '',
    defaultValue: '',
  },
  businessABN: {
    isRequired: true,
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
    validate: value => {
      if (value.length > 500) {
        return 'Description cannot exceed 500 characters';
      }
      return null;
    },
    value: '',
    defaultValue: 'Description',
  },
});

const createStep2Data = (): Step2FormData => ({
  firstName: {
    isRequired: true,
    validate: value => {
      if (value.trim().length < 1) {
        return 'First name is required';
      }
      if (value.length > 50) {
        return 'First name cannot exceed 50 characters';
      }
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
    validate: value => {
      if (value.trim().length < 1) {
        return 'Last name is required';
      }
      if (value.length > 50) {
        return 'Last name cannot exceed 50 characters';
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
      }
      return null;
    },
    value: '',
    defaultValue: 'Last Name',
  },
});

const createStep3Data = (): Step3FormData => ({
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
});

const createStep4Data = (): Step4FormData => ({
  country: {
    isRequired: true,
    value: 'Australia',
    defaultValue: 'Australia',
  },
  streetNumber: {
    isRequired: true,
    validate: value => {
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
    validate: value => {
      if (!/^\d{4}$/.test(value.trim())) {
        return 'Australian postcode must be exactly 4 digits';
      }
      return null;
    },
    value: '',
    defaultValue: '',
  },
});

const createStep5Data = (): Step5FormData => ({
  phone: {
    isRequired: true,
    validate: value => {
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
});

const createStep6Data = (): Step6FormData => ({
  contactPersonName: {
    isRequired: true,
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
    validate: value => {
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
});

const createStep7Data = (): Step7FormData => ({
  website: {
    isRequired: false,
    validate: value => {
      if (!value.trim()) {
        return null;
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
    validate: value => {
      if (!value.trim()) {
        return null;
      }
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return 'Facebook URL must start with http:// or https://';
        }
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
    validate: value => {
      if (!value.trim()) {
        return null;
      }
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return 'Twitter URL must start with http:// or https://';
        }
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
});

const createStep8Data = (): Step8FormData => ({
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

export default function BusinessRegistration() {
  const [sectionStep, setSectionStep] = useState<number>(1);

  // Create independent state for each step
  const [step1Data, setStep1Data] = useState<Step1FormData>(createStep1Data());
  const [step2Data, setStep2Data] = useState<Step2FormData>(createStep2Data());
  const [step3Data, setStep3Data] = useState<Step3FormData>(createStep3Data());
  const [step4Data, setStep4Data] = useState<Step4FormData>(createStep4Data());
  const [step5Data, setStep5Data] = useState<Step5FormData>(createStep5Data());
  const [step6Data, setStep6Data] = useState<Step6FormData>(createStep6Data());
  const [step7Data, setStep7Data] = useState<Step7FormData>(createStep7Data());
  const [step8Data, setStep8Data] = useState<Step8FormData>(createStep8Data());

  const [error, setError] = useState<ErrorState>({});

  // Generic field validation function that can be used in handleInputChange and nextStep
  const validateField = <T extends FormDataRecord>(
    formData: T,
    fieldName: keyof T,
    value?: string | string[]
  ): string | undefined => {
    const currentField = formData[fieldName];

    // Skip validation if field doesn't exist in form data
    if (
      !currentField ||
      typeof currentField !== 'object' ||
      !('value' in currentField)
    ) {
      return undefined;
    }

    // If no value is provided, use the field's current value
    const fieldValue = value ?? currentField.value;

    // Check required field validation
    // For arrays, check if array is empty
    const isEmpty = Array.isArray(fieldValue)
      ? fieldValue.length === 0
      : !fieldValue;
    if (currentField.isRequired && isEmpty) {
      return 'This field is required';
    }

    // Run custom validation if provided
    if (currentField.validate) {
      // Special handling for confirmPassword - need to get password from the same formData
      if (fieldName === 'confirmPassword' && 'password' in formData) {
        const passwordField = formData.password as { value: string };
        const validationMsg = currentField.validate(
          fieldValue as string,
          passwordField.value
        );
        return validationMsg ?? undefined;
      }
      const validationMsg = currentField.validate(fieldValue);
      return validationMsg ?? undefined;
    }

    return undefined;
  };

  // Generic field update and validation function
  const handleInputChange = <T extends FormDataRecord>(
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    fieldName: keyof T,
    value: string | string[]
  ) => {
    const currentField = formData[fieldName];
    if (
      currentField &&
      typeof currentField === 'object' &&
      'value' in currentField
    ) {
      // Update field value
      setFormData({
        ...formData,
        [fieldName]: { ...currentField, value },
      });

      // Validate field using validateField function
      const errorMsg = validateField(formData, fieldName, value);

      // Update error state
      if (errorMsg) {
        setError(prev => ({ ...prev, [fieldName as string]: errorMsg }));
      } else {
        setError(prev => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { [fieldName as string]: _, ...rest } = prev as Record<
            string,
            string
          >;
          return rest;
        });
      }
    }
  };

  // Validate all fields for the specified step, return whether there are errors
  const validateStepFields = (step: number): boolean => {
    let stepData:
      | Step1FormData
      | Step2FormData
      | Step3FormData
      | Step4FormData
      | Step5FormData
      | Step6FormData
      | Step7FormData
      | Step8FormData;

    switch (step) {
      case 1:
        stepData = step1Data;
        break;
      case 2:
        stepData = step2Data;
        break;
      case 3:
        stepData = step3Data;
        break;
      case 4:
        stepData = step4Data;
        break;
      case 5:
        stepData = step5Data;
        break;
      case 6:
        stepData = step6Data;
        break;
      case 7:
        stepData = step7Data;
        break;
      case 8:
        stepData = step8Data;
        break;
      default:
        return false;
    }

    const stepErrors: Partial<ErrorState> = {};

    // Extract all fields directly from stepData and validate
    Object.keys(stepData).forEach(key => {
      // Use validateField to validate field
      const errorMsg = validateField(stepData, key as keyof typeof stepData);
      if (errorMsg) {
        stepErrors[key as keyof BusinessRegistrationFormData] = errorMsg;
      }
    });

    // Set error state: clear errors for current step, add new errors
    setError(prev => ({
      ...Object.fromEntries(
        Object.entries(prev).filter(
          ([key]) => !Object.keys(stepData).includes(key)
        )
      ),
      ...stepErrors,
    }));

    // Check if there are errors
    const hasError = Object.keys(stepErrors).length > 0;

    return hasError;
  };

  const nextStep = () => {
    // Validate all fields for current step
    const hasError = validateStepFields(sectionStep);

    // Only proceed to next step when error length is 0
    if (hasError) {
      return;
    }

    setSectionStep(prev => prev + 1);
  };

  const prevStep = () => {
    setSectionStep(prev => prev - 1);
  };
  const handleSubmit = async () => {
    // Validate the last step (step 8)
    const hasError = validateStepFields(8);

    if (hasError) {
      return;
    }

    // Collect and merge data from all steps
    // Since data is already flattened, all fields are BusinessField type, just extract value
    type ExtractValues<T> = {
      [K in keyof T]: T[K] extends { value: infer V } ? V : string | string[];
    };

    function extractFormValues<T>(formData: T): ExtractValues<T> {
      // Since all fields are BusinessField type, directly extract value
      return Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [
          key,
          (val as BusinessField<string | string[]>).value,
        ])
      ) as ExtractValues<T>;
    }

    // Merge data from all steps
    const mergedFormData: BusinessRegistrationFormData = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
      ...step4Data,
      ...step5Data,
      ...step6Data,
      ...step7Data,
      ...step8Data,
    };

    // Extract all values
    const data = extractFormValues(mergedFormData);
    delete data.confirmPassword; // Remove confirmPassword before submission

    // Combine address fields from step4Data into businessAddress object
    const businessAddress = {
      country: step4Data.country.value,
      streetNumber: step4Data.streetNumber.value,
      street: step4Data.street.value,
      suburb: step4Data.suburb.value,
      city: step4Data.city.value,
      state: step4Data.state.value,
      postcode: step4Data.postcode.value,
    };

    // Delete scattered address fields, add businessAddress object
    delete data.country;
    delete data.streetNumber;
    delete data.street;
    delete data.suburb;
    delete data.city;
    delete data.state;
    delete data.postcode;
    data.businessAddress = businessAddress;

    const response = await registerBusiness(data);
    if (response.successful || response.success) {
      nextStep();
    }
  };

  return (
    <BusinessRegistrationFlow
      sectionStep={sectionStep}
      step1Data={step1Data}
      setStep1Data={setStep1Data}
      step2Data={step2Data}
      setStep2Data={setStep2Data}
      step3Data={step3Data}
      setStep3Data={setStep3Data}
      step4Data={step4Data}
      setStep4Data={setStep4Data}
      step5Data={step5Data}
      setStep5Data={setStep5Data}
      step6Data={step6Data}
      setStep6Data={setStep6Data}
      step7Data={step7Data}
      setStep7Data={setStep7Data}
      step8Data={step8Data}
      setStep8Data={setStep8Data}
      error={error}
      setError={setError}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onNext={nextStep}
      onPrev={prevStep}
    />
  );
}
