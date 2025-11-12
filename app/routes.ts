import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./routes/_index.tsx'),
  route('help', './routes/help.tsx'),
  route('business', './routes/business-info.tsx'),
  route('business-dashboard', './routes/business-dashboard.tsx'),
  route('business-management', './routes/business-management.tsx'),
  route('user-management', './routes/user-management.tsx'),
  route('deal-details/:id', './routes/deal-details.$id.tsx'),
  route('login', './routes/login.tsx'),
  route('profile', './routes/profile.tsx'),
  route('business-registration', './routes/business-registration.tsx'),
  route('customer-registration', './routes/customer-registration.tsx'),
  route('verify-email', './routes/customer-verify-email.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
