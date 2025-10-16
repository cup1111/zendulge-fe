import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./routes/_index.tsx"),
    route("help", "./routes/help.tsx"),
    route("business", "./routes/business-info.tsx"),
    route("business-management", "./routes/business-management.tsx"),
    route("deal-details/:id", "./routes/deal-details.$id.tsx"),
    route("login", "./routes/login.tsx"),
    route("signup", "./routes/signup.tsx"),
    route("profile", "./routes/profile.tsx"),
    route("business-register", "./routes/business-register.tsx"),
    route("*", "./routes/404.tsx"),
] satisfies RouteConfig;
