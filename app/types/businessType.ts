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

export type BusinessRegistrationFormData = {
  businessName: BusinessField<string>;
  companyName: BusinessField<string>;
  businessABN: BusinessField<string>;
  businessLogo: BusinessField<string>;
  description: BusinessField<string>;
  firstName: BusinessField<string>;
  lastName: BusinessField<string>;
  categories: BusinessField<string[]>;
  // Address fields flattened
  country: BusinessField<string>;
  streetNumber: BusinessField<string>;
  street: BusinessField<string>;
  suburb: BusinessField<string>;
  city: BusinessField<string>;
  state: BusinessField<string>;
  postcode: BusinessField<string>;
  phone: BusinessField<string>;
  businessEmail: BusinessField<string>;
  contactPersonName: BusinessField<string>;
  contactPersonEmail: BusinessField<string>;
  contactPersonPhone: BusinessField<string>;
  website: BusinessField<string>;
  facebook: BusinessField<string>;
  twitter: BusinessField<string>;
  email: BusinessField<string>;
  password: BusinessField<string>;
  confirmPassword: BusinessField<string>;
};

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
  companyName: string;
  businessABN: string;
  businessLogo: string;
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
