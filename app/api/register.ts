import axios from 'axios';

export const registerCustomer = async (data: any) => {
  const response = await axios.post(
    'https://zendulge-be-production.up.railway.app/api/v1/register',
    {
      email: data.email,
      password: data.password,
      firstName: 'asdf',
      lastName: 'asdf',
    }
  );
  return response.data;
};

export const registerBusiness = async (data: any) => {
  const response = await axios.post(
    'https://zendulge-be-production.up.railway.app/api/v1/business-register',
    {
      companyName: data.companyName,
      description: data.description,
      firstName: data.firstName,
      lastName: data.lastName,
      categories: data.categories,
      serviceCategory: data.serviceCategory,
      jobTitle: data.jobTitle,
      businessAddress: {
        country: data.businessAddress.country,
        streetNumber: data.businessAddress.streetNumber,
        street: data.businessAddress.street,
        suburb: data.businessAddress.suburb,
        city: data.businessAddress.city,
        state: data.businessAddress.state,
        postcode: data.businessAddress.postcode,
      },
      phone: data.phone,
      companyEmail: data.companyEmail,
      contactPersonName: data.contactPersonName,
      contactPersonEmail: data.contactPersonEmail,
      contactPersonPhone: data.contactPersonPhone,
      website: data.website,
      facebook: data.facebook,
      twitter: data.twitter,
      email: data.email,
      password: data.password,
    }
  );
  return response.data;
};
