import TestingRegistration from "~/routes/registration";

export function loader() {
  return null;
}

export default function TestCustomerRegistration() {
  return <TestingRegistration type="customer" />;
}