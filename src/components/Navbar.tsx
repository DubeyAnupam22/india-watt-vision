
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Home,
  LogOut,
  Settings,
  Upload,
  FileText,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { isAuthenticated, user, logout, canUploadData } = useAuth();
  const location = useLocation();
  
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
      showAlways: true,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      showWhen: isAuthenticated,
    },
    {
      name: "Data Upload",
      path: "/data-upload",
      icon: <Upload className="h-5 w-5" />,
      showWhen: isAuthenticated && canUploadData(),
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FileText className="h-5 w-5" />,
      showWhen: isAuthenticated,
    },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-energy rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Waste2Watt</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {navItems
              .filter((item) => item.showAlways || item.showWhen)
              .map((item) => (
                <Link 
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium",
                    location.pathname === item.path
                      ? "border-w2w-green-500 text-w2w-green-700 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Link>
              ))}
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                </div>
                <UserCircle className="h-8 w-8 text-w2w-green-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only md:not-sr-only md:ml-1">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-w2w-green-500 hover:bg-w2w-green-600">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="grid grid-cols-4 divide-x divide-gray-200">
          {navItems
            .filter((item) => item.showAlways || item.showWhen)
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-3",
                  location.pathname === item.path
                    ? "text-w2w-green-500"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {item.icon}
                <span className="mt-1 text-xs">{item.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
