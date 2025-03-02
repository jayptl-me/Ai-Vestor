
import { useState, useEffect, useRef } from "react";
import { ChartLine, TrendingUp, AreaChart } from "lucide-react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ActionCard from "../components/ActionCard";
import { Button } from "../components/ui/button";

const Index = () => {
  const [visibleSection, setVisibleSection] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Market Overview Section */}
        {/* <MarketOverview /> */}

        {/* Call to Action Cards */}
        <section ref={sectionRef} className="section-padding">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Start Making Smarter Investment Decisions Today
              </h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                Choose from our powerful suite of AI-powered investment tools to enhance your
                portfolio strategy and maximize returns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ActionCard
                icon={<ChartLine className="h-7 w-7 text-primary" />}
                title="Stock Price Prediction"
                description="Get AI-powered forecasts for stock prices based on historical data and market patterns."
                action="Predict Stock Prices"
                link="/stock-prediction"
                delay={0}
                isVisible={visibleSection}
              />
              <ActionCard
                icon={<TrendingUp className="h-7 w-7 text-primary" />}
                title="Risk Assessment"
                description="Analyze potential risks in your investments and get recommendations for portfolio optimization."
                action="Analyze Risk Factors"
                link="/risk-analyzer"
                delay={100}
                isVisible={visibleSection}
              />
              <ActionCard
                icon={<AreaChart className="h-7 w-7 text-primary" />}
                title="LearnYard"
                description="Get to know about the investing world."
                action="Learn More"
                link="/learn-yard"
                delay={200}
                isVisible={visibleSection}
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-primary/5 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Investment Strategy?
              </h2>
              <p className="text-lg mb-8">
                Join thousands of investors who are already leveraging our AI-powered platform
                to make smarter investment decisions and achieve better returns.
              </p>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">
                <span className="text-primary font-semibold">AI</span>
                Investor
              </h3>
              <p className="text-foreground/70 mb-4">
                Advanced AI-powered investment analysis tools for the modern investor.
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-primary">Stock Prediction</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Risk Analysis</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">News & Sentiment</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Portfolio Health</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Press</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Disclaimers</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-foreground/60 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Investor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
