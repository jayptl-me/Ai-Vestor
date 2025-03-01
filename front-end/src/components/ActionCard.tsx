
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
  delay?: number;
  isVisible?: boolean;
}

const ActionCard = ({
  icon,
  title,
  description,
  action,
  link,
  delay = 0,
  isVisible = true,
}: ActionCardProps) => {
  return (
    <div
      className={`glass-morphism rounded-2xl overflow-hidden transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-foreground/70 mb-6">{description}</p>
        <Button
          variant="ghost"
          className="group text-primary hover:text-primary hover:bg-primary/5 p-0"
          asChild
        >
          <a href={link} className="flex items-center">
            {action}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ActionCard;
