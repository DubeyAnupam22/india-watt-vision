
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab("login");
      // In a real app, this would register the user
    }, 1500);
  };
  
  // For demo purposes, add quick login buttons
  const handleQuickLogin = (role: string) => {
    switch(role) {
      case 'admin':
        setEmail('admin@waste2watt.in');
        setPassword('password');
        break;
      case 'researcher':
        setEmail('researcher@waste2watt.in');
        setPassword('password');
        break;
      case 'public':
        setEmail('viewer@waste2watt.in');
        setPassword('password');
        break;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="flex flex-col items-center mb-8">
        <div className="h-12 w-12 bg-gradient-energy rounded-md flex items-center justify-center mb-4">
          <span className="text-white font-bold text-2xl">⚡</span>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900">Waste2Watt India</h1>
        <p className="text-gray-600 mt-2 max-w-md text-center">
          Transforming waste management through data-driven energy solutions
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            Login to access the Waste-to-Energy feasibility platform
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-4">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-w2w-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-w2w-green-500 hover:bg-w2w-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              
              {/* Demo Quick Login Section */}
              <div className="mt-6 border-t pt-4">
                <div className="text-sm text-gray-500 mb-3">Demo Quick Login:</div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('admin')}>
                    Admin
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('researcher')}>
                    Researcher
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('public')}>
                    Public User
                  </Button>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Password: "password" for all demo accounts
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" disabled={isLoading} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    id="organization" 
                    placeholder="Your organization name" 
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-w2w-blue-500 hover:bg-w2w-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-2 border-t pt-4">
          <div className="text-sm text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <div>Ministry of New and Renewable Energy</div>
        <div className="mt-1">Government of India Initiative</div>
      </div>
    </div>
  );
};

export default Login;
