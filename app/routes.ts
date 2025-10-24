import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./routes/_index.tsx'),
  route('help', './routes/help.tsx'),
  route('business', './routes/business-info.tsx'),
  route('business-management', './routes/business-management.tsx'),
  route('deal-details/:id', './routes/deal-details.$id.tsx'),
  route('login', './routes/login.tsx'),
  route('profile', './routes/profile.tsx'),
  route('business-registration', './routes/business-registration.tsx'), // 末尾加上提示收到邮箱验证 查看邮箱做验证 验证之后可能再审核之类
  route('customer-registration', './routes/customer-registration.tsx'), // 分开 customer和business
  route('/verify-email', './routes/customer-registration-validate.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
