import axios from "axios";

export const registerCustomer = async (data: any) => {
    const response = await axios.post("https://zendulge-be-production.up.railway.app/api/v1/register", {
        email: data.email,
        password: data.password,// TODO frontend 加上password和confirmPassword
    });
    return response.data;
}

export const registerBusiness = async (data: any) => {
    const response = await axios.post("https://zendulge-be-production.up.railway.app/api/v1/business-register", {
        businessName: data.businessName,
        description: data.description,
        firstName: data.firstName,
        lastName: data.lastName,
        categories: data.categories,
        primaryCategory: data.primaryCategory,
        jobTitle: data.jobTitle,
        address: {
        country: data.address.country,
        streetNumber: data.address.streetNumber,
        streetName: data.address.streetName,
        suburb: data.address.suburb,
        city: data.address.city,
        state: data.address.state,
        postalCode: data.address.postalCode,
        fullAddress: data.address.fullAddress
        },
        phone: data.phone,
        email: data.email,
        contactPersonName: data.contactPersonName,
        contactPersonEmail: data.contactPersonEmail,
        contactPersonPhone: data.contactPersonPhone,
        website: data.website,
        facebook: data.facebook,
        twitter: data.twitter,
        logo: data.logo
    });
    return response.data;
}