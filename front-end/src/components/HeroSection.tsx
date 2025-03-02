
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Text animation effect for each section
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grain"></div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-[40%] h-[50%] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtitle */}
          <div
            className={`inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium transform transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Next-Generation Investment Intelligence
          </div>

          {/* Main heading */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 transition-all duration-700 delay-100 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Make Smarter Investment Decisions with{" "}
            <span className="text-primary">AI-Powered</span> Insights
          </h1>

          {/* Description */}
          <p
            className={`text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Our platform combines advanced artificial intelligence with comprehensive market data
            to help you predict trends, analyze risks, and optimize your investment portfolio.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >

          </div>

          {/* Stats */}
          <div
            className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center transition-all duration-700 delay-400 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            {[
              { value: "93%", label: "Prediction Accuracy" },
              { value: "10M+", label: "Data Points Analyzed" },
              { value: "24/7", label: "Real-time Updates" },
              { value: "50K+", label: "Active Investors" },
            ].map((stat, index) => (
              <div key={index} className="glass-morphism rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
