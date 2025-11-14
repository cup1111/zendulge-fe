import axios from 'axios';

import type { BusinessRegisterPayload } from '../types/businessType';

export const registerCustomer = async (customerRegistrationData: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    'https://zendulge-be-production.up.railway.app/api/v1/register',
    {
      email: customerRegistrationData.email,
      password: customerRegistrationData.password,
      firstName: 'asdf',
      lastName: 'asdf',
    }
  );
  return response.data;
};

export const registerBusiness = async (
  businessRegistrationData: BusinessRegisterPayload
) => {
  const response = await axios.post(
    'https://zendulge-be-production.up.railway.app/api/v1/business-register',
    {
      businessName: businessRegistrationData.businessName,
      businessABN: businessRegistrationData.businessABN,
      description: businessRegistrationData.description,
      firstName: businessRegistrationData.firstName,
      lastName: businessRegistrationData.lastName,
      categories: businessRegistrationData.categories,
      jobTitle: businessRegistrationData.jobTitle,
      businessAddress: {
        country: businessRegistrationData.businessAddress.country,
        streetNumber: businessRegistrationData.businessAddress.streetNumber,
        street: businessRegistrationData.businessAddress.street,
        suburb: businessRegistrationData.businessAddress.suburb,
        city: businessRegistrationData.businessAddress.city,
        state: businessRegistrationData.businessAddress.state,
        postcode: businessRegistrationData.businessAddress.postcode,
      },
      phone: businessRegistrationData.phone,
      businessEmail: businessRegistrationData.businessEmail,
      contactPersonName: businessRegistrationData.contactPersonName,
      contactPersonEmail: businessRegistrationData.contactPersonEmail,
      contactPersonPhone: businessRegistrationData.contactPersonPhone,
      website: businessRegistrationData.website,
      facebook: businessRegistrationData.facebook,
      twitter: businessRegistrationData.twitter,
      email: businessRegistrationData.email,
      password: businessRegistrationData.password,
    }
  );
  return response.data;
};
