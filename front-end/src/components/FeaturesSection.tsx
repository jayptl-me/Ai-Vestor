
import { useState, useEffect, useRef } from "react";
import { ChartLine, TrendingUp, LineChart, Lightbulb, AreaChart, Globe } from "lucide-react";

const features = [
  {
    icon: ChartLine,
    title: "Stock Price Prediction",
    description:
      "Advanced AI models analyze historical data and market patterns to forecast future stock price movements with high accuracy.",
  },

  {
    icon: LineChart,
    title: "News & Sentiment Analysis",
    description:
      "Real-time analysis of financial news and social media sentiment to identify market trends before they become obvious.",
  },

  {
    icon: Globe,
    title: "Global Market Sentiment",
    description:
      "Aggregated market sentiment analysis showing trends by region and industry to inform global investment strategies.",
  },
];

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          if (entry.isIntersecting) {
            setVisibleFeatures((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    featuresRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featuresRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Powerful Features for Modern Investors
          </h2>
          <p className="text-lg text-foreground/70">
            Our AI-driven platform provides comprehensive tools designed to enhance
            your investment strategy and decision-making process.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              data-index={index}
              className={`glass-morphism p-6 rounded-2xl transition-all duration-700 ease-out transform ${visibleFeatures.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
