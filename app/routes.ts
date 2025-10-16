import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./routes/_index.tsx'),
  route('help', './routes/help.tsx'),
  route('business', './routes/business-info.tsx'),
  route('business-management', './routes/business-management.tsx'),
  route('deal-details/:id', './routes/deal-details.$id.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
