
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { ArrowRight, BarChart3, Book, Calculator, Leaf, Recycle } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-energy text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Waste2Watt India
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Transforming India's waste management through data-driven 
              energy solution feasibility analysis
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  asChild
                  className="bg-white text-w2w-green-600 hover:bg-gray-100"
                >
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  asChild
                  className="bg-white text-w2w-green-600 hover:bg-gray-100"
                >
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Platform Features
              </h2>
              <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                Comprehensive tools for waste-to-energy feasibility analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Data Management",
                  description: "Upload and manage municipal solid waste data for cities across India",
                  icon: <Recycle className="h-10 w-10 text-w2w-green-500" />,
                },
                {
                  title: "Energy Potential Calculations",
                  description: "Estimate energy output potential based on waste composition and volume",
                  icon: <Calculator className="h-10 w-10 text-w2w-blue-500" />,
                },
                {
                  title: "Analytics & Visualization",
                  description: "Interactive charts and reports to visualize data and comparisons",
                  icon: <BarChart3 className="h-10 w-10 text-w2w-amber-500" />,
                },
              ].map((feature, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Environmental & Economic Benefits
              </h2>
              <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                Waste-to-Energy technology offers multiple advantages for India's sustainable development
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Reduced Landfill Usage",
                  description: "Decrease the need for landfill space by up to 90%",
                  color: "bg-green-100 text-green-700",
                },
                {
                  title: "Energy Generation",
                  description: "Convert waste into valuable electricity and heat",
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  title: "Lower Carbon Emissions",
                  description: "Reduce greenhouse gas emissions compared to landfilling",
                  color: "bg-amber-100 text-amber-700",
                },
                {
                  title: "Economic Opportunities",
                  description: "Create jobs and revenue from waste processing",
                  color: "bg-purple-100 text-purple-700",
                },
              ].map((benefit, index) => (
                <Card key={index} className={`border-none ${benefit.color}`}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About Waste2Watt India
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Waste2Watt is a government initiative aimed at promoting sustainable waste management practices across India through waste-to-energy technology implementation.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our platform helps local government bodies, researchers, and waste management professionals make data-backed decisions about implementing waste-to-energy facilities in their regions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-green-600 mr-2" />
                    <span>Sustainable Solutions</span>
                  </div>
                  <div className="flex items-center">
                    <Book className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Research-Backed</span>
                  </div>
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-amber-600 mr-2" />
                    <span>Data-Driven Analysis</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-gray-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-energy rounded-md flex items-center justify-center mb-6 mx-auto">
                    <span className="text-white font-bold text-3xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                  <blockquote className="italic text-gray-700">
                    "To empower cities across India with the tools and knowledge needed to transform waste management challenges into sustainable energy opportunities."
                  </blockquote>
                  <div className="mt-6 text-sm text-gray-600">
                    Supported by the Ministry of New and Renewable Energy, Government of India
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-w2w-blue-600 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to explore waste-to-energy opportunities?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join Waste2Watt India and start analyzing the energy potential of your city's waste today.
            </p>
            <Button 
              size="lg"
              asChild
              className="bg-white text-w2w-blue-600 hover:bg-gray-100"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">Go to Dashboard</Link>
              ) : (
                <Link to="/login">Get Started Now</Link>
              )}
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-gradient-energy rounded-md flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <span className="font-bold text-xl">Waste2Watt</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming waste management through data-driven energy solutions
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/reports" className="text-gray-400 hover:text-white">Reports</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API Access</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Research Papers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Webinars</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partner With Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Media Inquiries</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2023 Waste2Watt India. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
