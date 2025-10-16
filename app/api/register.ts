import axios from "axios";

export const registerCustomer = async (data: any) => {
    const response = await axios.post("https://localhost:3000/api/v1/auth/register/customer", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        interests: data.interests,
        password: data.password,
        confirmPassword: data.confirmPassword,
        terms: data.terms,
        privacy: data.privacy,
        marketing: data.marketing,
        newsletter: data.newsletter,
    });
    return response.data;
}