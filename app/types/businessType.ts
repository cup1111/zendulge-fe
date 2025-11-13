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
  companyName: BusinessField<string>;
  companyABN: BusinessField<string>;
  description: BusinessField<string>;
  firstName: BusinessField<string>;
  lastName: BusinessField<string>;
  categories: BusinessField<string[]>;
  jobTitle: BusinessField<string>;
  businessAddress: BusinessAddress;
  phone: BusinessField<string>;
  companyEmail: BusinessField<string>;
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

type AddressErrorState = {
  [K in keyof BusinessAddress]?: string;
};

export type ErrorState = {
  [K in keyof BusinessRegistrationFormData]: K extends 'businessAddress'
    ? AddressErrorState
    : string;
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
  companyName: string;
  companyABN: string;
  description: string;
  firstName: string;
  lastName: string;
  categories: string[];
  jobTitle: string;
  businessAddress: BusinessAddressValue;
  phone: string;
  companyEmail: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  email: string;
  password: string;
};
