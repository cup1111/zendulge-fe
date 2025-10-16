import TestingRegistration from "~/routes/registration";

export function loader() {
  return null;
}

export default function TestBusinessRegistration() {
  return <TestingRegistration type="business" />;
}