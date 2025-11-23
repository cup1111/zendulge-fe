export type BusinessField<T> = {
  isRequired?: boolean;
  validate?: (value: T, ...args: string[]) => string | null;
  value: T;
  defaultValue: T;
};

export type BusinessAddress = {
  country: BusinessField<string>;
  streetNumber: BusinessField<string>;
  street: BusinessField<string>;
  suburb: BusinessField<string>;
  city: BusinessField<string>;
  state: BusinessField<string>;
  postcode: BusinessField<string>;
};

// Step 1: Basic Information
export type BusinessBasicInfo = {
  businessName: BusinessField<string>;
  companyLogo: BusinessField<string>;
  businessABN: BusinessField<string>;
  description: BusinessField<string>;
};

// Step 2: Business Group Admin Information
export type OwnerIdentity = {
  firstName: BusinessField<string>;
  lastName: BusinessField<string>;
};

// Step 3: Service Categories
export type BusinessCategory = {
  categories: BusinessField<string[]>;
};

// Step 4: Business Address
export type BusinessAddressFormData = BusinessAddress;

// Step 5: Contact Information
export type BusinessContact = {
  phone: BusinessField<string>;
  selectedCountry: BusinessField<string>;
  businessEmail: BusinessField<string>;
};

// Step 6: Contact Person
export type ContactPerson = {
  contactPersonName: BusinessField<string>;
  contactPersonEmail: BusinessField<string>;
  contactPersonPhone: BusinessField<string>;
  contactPersonSelectedCountry: BusinessField<string>;
};

// Step 7: Branding & Social Media
export type BusinessSocialMedia = {
  website: BusinessField<string>;
  facebook: BusinessField<string>;
  twitter: BusinessField<string>;
};

// Step 8: Login Information
export type AccountCredentials = {
  email: BusinessField<string>;
  password: BusinessField<string>;
  confirmPassword: BusinessField<string>;
};

export type FormDataRecord = Record<
  string,
  BusinessField<string> | BusinessField<string[]>
>;

// Complete form data type (for backward compatibility and final merging)
export type BusinessRegistrationFormData = BusinessBasicInfo &
  OwnerIdentity &
  BusinessCategory &
  BusinessAddressFormData &
  BusinessContact &
  ContactPerson &
  BusinessSocialMedia &
  AccountCredentials;

export type ErrorState = {
  [K in keyof BusinessRegistrationFormData]?: string;
};

type BusinessAddressValue = {
  country: string;
  streetNumber: string;
  street: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
};

export type BusinessRegisterPayload = {
  businessName: string;
  businessABN: string;
  description: string;
  firstName: string;
  lastName: string;
  categories: string[];
  businessAddress: BusinessAddressValue;
  phone: string;
  businessEmail: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  email: string;
  password: string;
};
