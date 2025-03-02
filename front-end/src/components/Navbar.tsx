import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const location = useLocation();

  // Main navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Stock Prediction", path: "/stock-prediction" },
    {
      name: "Learn Yard",
      path: "/learn-yard",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isSubMenuOpen = (name: string) => openSubMenus.includes(name);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-6"
        }`}
    >
      <div className="container mx-auto px-4">
        {/* Reverted Desktop Navbar: Floating Glassmorphic Design */}
        <div
          className={`rounded-xl backdrop-blur-xl transition-all duration-300 px-4 py-3 ${isScrolled
            ? "bg-white/80 dark:bg-black/80 shadow-lg"
            : "bg-white/50 dark:bg-black/50"
            }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-medium tracking-tight flex items-center"
            >
              <span className="text-primary font-semibold mr-1">AI</span>
              <span className="font-bold">Investor</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {!link.subLinks ? (
                    <Link
                      to={link.path}
                      className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path
                        ? "text-primary"
                        : "text-foreground/80"
                        }`}
                    >
                      {link.name}
                      <span
                        
                        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${location.pathname === link.path ? "scale-x-100" : "scale-x-0"
                          } group-hover:scale-x-100`}
                      ></span>
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-primary">
                      <span className="text-sm font-medium">{link.name}</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-lg overflow-hidden bg-white/90 dark:bg-background/95 backdrop-blur-md shadow-xl ring-1 ring-black/5 dark:ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                        <div className="py-1">
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.name}
                              to={subLink.path}
                              className="block px-4 py-2 text-sm text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/20 dark:hover:bg-black/20"
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 shadow-md transition-all"
              >
                Sign up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[73px] backdrop-blur-xl bg-white/90 dark:bg-background/95 z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col h-full">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                {!link.subLinks ? (
                  <Link
                    to={link.path}
                    className={`text-base font-medium py-2 ${location.pathname === link.path
                      ? "text-primary font-semibold"
                      : "text-foreground"
                      }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <>
                    <button
                      className="flex items-center justify-between py-2 w-full text-left"
                      onClick={() => toggleSubMenu(link.name)}
                    >
                      <span className="text-base font-medium">{link.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isSubMenuOpen(link.name) ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`pl-4 border-l border-border ml-2 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${isSubMenuOpen(link.name)
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.name}
                          to={subLink.path}
                          className="block py-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto flex flex-col space-y-3 pt-6 border-t border-border">
            <Button variant="outline" className="w-full justify-center">
              Log in
            </Button>
            <Button className="w-full justify-center bg-primary hover:bg-primary/90 shadow-md">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
