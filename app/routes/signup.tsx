import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import { Button } from "~/components/ui/button";
import heroBackground from "~/assets/massage.jpeg";
import appIcon from "~/assets/app-icon.png";
import { Input } from "~/components/ui/input";
import { Link } from "react-router";


export default function Signup() {
return (
    <div className="min-h-screen">
    {/* Hero Section */}
    <section
        className="relative min-h-screen bg-gradient-to-br from-frosted-lilac to-pure-white pt-16 pb-16"
        style={{
        backgroundImage: `linear-gradient(rgba(248, 245, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        }}
    >
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
            {/* App Icon */}
            <div className="flex justify-center mb-6">
            <img
                src={appIcon}
                alt="Zendulge App Icon"
                className="w-24 h-24 rounded-2xl shadow-lg"
            />
            </div>

            {/* Tagline */}
            <h1
            className="text-5xl text-gray-900 max-w-3xl mx-auto mb-8 font-semibold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
            >
            Sign up and book your next appointment!
            </h1>
        </div>
        
        {/* Login Form */}
        <Card className="text-center shadow-2xl">
            <CardHeader className="pb-6">
            <CardTitle className="text-3xl">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-8">
            <Input 
                className="h-12 text-base" 
                type="email" 
                placeholder="Email" 
            />
            <Input 
                className="h-12 text-base" 
                type="password" 
                placeholder="Password" 
            />
            <Input 
                className="h-12 text-base" 
                type="Password" 
                placeholder="Confirm Password" 
            />
            <Button 
                variant="default" 
                className="w-full h-12 text-base mt-6"
            >
                Sign Up
            </Button>
            <div className="flex justify-center">
                <p className="text-sm text-gray-600">Already have an account?</p>
            </div>
            <Button 
                variant="default" 
                className="w-full h-12 text-base"
            >
                <Link to="/login">Login</Link>
            </Button>
            </CardContent>
            
        </Card>
        </div>
    </section>
    </div>
);
}
