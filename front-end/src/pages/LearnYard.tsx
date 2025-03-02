import React, { useState } from 'react';
import { Play, ChevronLeft, Clock, CheckCircle, BookOpen, Award, ChevronRight, Rocket, Sparkles, Flame, Shield, Bookmark, PieChart, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

interface Video {
  title: string;
  duration: string;
  completed?: boolean;
  youtubeUrl?: string;
}

interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: React.ReactNode;
  color: string;
  videos: Video[];
  emoji: string;
}

const courses: Course[] = [
  {
    id: 'basic',
    title: 'Start from Scratch: Stock Market 101',
    level: 'Beginner',
    description: 'New to investing? Learn the basics, key terminologies, and how to kickstart your journey with confidence.',
    icon: <Rocket className="w-6 h-6" />,
    color: 'green',
    emoji: '🚀',
    videos: [

      {
        "title": "Can I start trading with 1,000rs? | Money Psychology",
        "duration": "00:08:32",
        "youtubeUrl": "https://www.youtube.com/embed/A-LmEw6fsTg?si=jd8LokwFN03wDzgS",
        completed: true,
      },
      {
        "title": "How to deal with consecutive losses? | Money Psychology",
        "duration": "00:13:00",
        "youtubeUrl": "https://www.youtube.com/embed/_UcBW1a9gPg?si=4MB-VhMlTpEDRFha"
      },
      {
        "title": "Complete guide to start trading | Money Psychology",
        "duration": "00:10:08",
        "youtubeUrl": "https://www.youtube.com/embed/C6CNKSj82ko?si=O_6MxFcc9UoYlvur"
      },
      {
        "title": "Options Trading Simplified - Common Mistakes to Avoid | Money Psychology",
        "duration": "00:12:20",
        "youtubeUrl": "https://www.youtube.com/embed/C6CNKSj82ko?si=RPxWXUZNqI0Dzpb7"
      },



    ]
  },
  {
    id: 'intermediate',
    title: 'Level Up: Strategies & Smart Investing',
    level: 'Intermediate',
    description: 'Explore market trends, risk management, and smart investing techniques to make informed decisions.',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'blue',
    emoji: '✨',
    videos: [
      { title: 'Understanding Market Cycles', duration: '00:10:15' },
      { title: 'Fundamental Analysis Basics', duration: '00:12:32' },
      { title: 'Technical Analysis Introduction', duration: '00:09:45' },
      { title: 'Risk Management Strategies', duration: '00:11:20' },
      { title: 'Building a Diversified Portfolio', duration: '00:08:55' },
    ]
  },
  {
    id: 'advanced',
    title: 'Master the Market: Pro-Level Insights',
    level: 'Advanced',
    description: 'Gain in-depth market analysis, portfolio diversification, and expert strategies for long-term success.',
    icon: <Flame className="w-6 h-6" />,
    color: 'yellow',
    emoji: '🔥',
    videos: [
      { title: 'Advanced Options Trading', duration: '00:14:25' },
      { title: 'Algorithmic Trading Basics', duration: '00:11:40' },
      { title: 'Portfolio Optimization Techniques', duration: '00:13:15' },
      { title: 'Macroeconomic Indicators & Markets', duration: '00:10:35' },
      { title: 'Alternative Investment Strategies', duration: '00:12:50' },
    ]
  }
];

const levelEmoji = {
  'Beginner': '🌱',
  'Intermediate': '🌟',
  'Advanced': '🔥'
};

const colorClasses = {
  green: {
    border: 'border-green-500/30 hover:border-green-500/70',
    bg: 'from-green-500/10 to-green-600/20',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    progress: 'bg-green-500',
    glow: 'shadow-green-400/20',
    hover: 'hover:shadow-green-400/30',
    iconBg: 'bg-green-500/20 text-green-600'
  },
  blue: {
    border: 'border-blue-500/30 hover:border-blue-500/70',
    bg: 'from-blue-500/10 to-indigo-500/20',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    progress: 'bg-blue-500',
    glow: 'shadow-blue-400/20',
    hover: 'hover:shadow-blue-400/30',
    iconBg: 'bg-blue-500/20 text-blue-600'
  },
  yellow: {
    border: 'border-yellow-500/30 hover:border-yellow-500/70',
    bg: 'from-yellow-500/10 to-orange-500/20',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    progress: 'bg-yellow-500',
    glow: 'shadow-yellow-400/20',
    hover: 'hover:shadow-yellow-400/30',
    iconBg: 'bg-yellow-500/20 text-yellow-600'
  }
};

const LearnYard: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);

  // If no course is selected, show the landing page
  if (!selectedCourse) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col font-sans">
        <Navbar />

        <div className="max-w-6xl mx-auto p-6 pt-24 relative">
          {/* Gradient Background Elements */}
          {/* Header Section */}
          <div className="text-center mb-16 opacity-100 transform-none">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mt-10">
              Stock Market Learning, Made Simple &  <span className="text-primary">Rewarding!</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
              Watch videos. Earn points. Build skills. Join thousands of Z-gen investors unlocking financial freedom.
            </p>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 mb-16">
            {[
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Why You Need This",
                text: "Because your money should work harder than you. Understanding stocks = better decisions, less risk, more financial freedom."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Nervous About Risk?",
                text: "Fear comes from not knowing. Most beginners hesitate due to uncertainty. With the right knowledge, you can minimize risks and invest with confidence."
              },
              {
                icon: <PieChart className="w-6 h-6" />,
                title: "Your Gains After This",
                text: "Clarity. Confidence. Control. You'll spot opportunities, avoid costly mistakes, and build wealth for your future—on your own terms."
              }
            ].map((card, index) => (
              <div
                key={index}
                className="glass-morphism p-6 rounded-xl bg-gradient-to-br from-background to-accent/30 backdrop-blur-sm border border-border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h2 className="font-bold text-xl text-foreground">{card.title}</h2>
                <p className="text-muted-foreground mt-2">{card.text}</p>
              </div>
            ))}
          </div>

          {/* Learning Paths - Stacked Cards */}
          <div className="mt-18 relative">
            <h2 className="text-3xl font-bold text-center mb-4">Choose Your Learning Path</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Stack your knowledge from beginner to pro. Each level unlocks deeper insights and advanced strategies.
            </p>

            {/* Stacked Cards Layout */}
            <div className="mt-24 relative">
              {/* Modern Card Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {courses.map((course) => {
                  const color = colorClasses[course.color as keyof typeof colorClasses];

                  return (
                    <div
                      key={course.id}
                      className={`p-6 rounded-xl border-2 ${color.border} ${color.glow} ${color.hover} backdrop-blur-sm bg-gradient-to-br ${color.bg} cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col h-full`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl ${color.iconBg} flex items-center justify-center`}>
                          {course.icon}
                        </div>

                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color.badge}`}>
                          {levelEmoji[course.level]} {course.level}
                        </span>
                      </div>

                      {/* Card Content */}
                      <h3 className="font-bold text-xl mb-3">{course.title}</h3>
                      <p className="text-muted-foreground mb-6 flex-grow">{course.description}</p>

                      {/* Course Features */}
                      <div className="grid grid-cols-1 gap-2 mb-6">
                        {['Core concepts', 'Market basics', 'Trading tools'].map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-background flex items-center justify-center">
                              <CheckCircle size={12} className="text-primary" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{course.videos.length} videos</span>
                        </div>

                        <Button size="sm" className="rounded-full px-4 gap-2">
                          <Play size={14} />
                          Start
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress based on completed videos in the selected course
  const videos = selectedCourse.videos;
  const progress = Math.round(((videos.filter(v => v.completed).length) / videos.length) * 100);
  const color = colorClasses[selectedCourse.color as keyof typeof colorClasses];

  // Video player view when course is selected
  return (
    <div className="w-full min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden mt-24">
        {/* Sidebar */}
        {showSidebar && (
          <div className="ml-5 mt-2 w-full md:w-1/3 max-w-md bg-card border-r border-border rounded-lg overflow-y-auto transition-all duration-300">
            <div className="mt-4 bg-card p-4 border-b border-border flex items-center justify-between">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${color.badge} mb-2`}>
                  {levelEmoji[selectedCourse.level]} {selectedCourse.level}
                </span>
                <h3 className="font-medium text-foreground">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-primary hover:text-primary/80 text-sm"
              >
                <ChevronLeft size={16} className="inline mr-1" />
                Back
              </button>
            </div>

            <div className="p-4 border-b border-border bg-accent/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className={`h-2 rounded-full ${color.progress}`} style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{videos.filter(v => v.completed).length}/{videos.length} lessons</span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-accent hover:translate-x-1 ${activeVideoIndex === index ? 'bg-accent/60 border-l-4 border-primary' : ''}`}
                  onClick={() => setActiveVideoIndex(index)}
                >
                  <div className="flex items-start">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${video.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      {video.completed ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${activeVideoIndex === index ? 'text-primary' : 'text-foreground'}`}>{video.title}</h4>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      </div>
                    </div>
                    {video.completed ? <Bookmark size={16} className="text-primary ml-2" /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden fixed top-20 left-3 z-20 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          >
            {showSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="flex-1 p-4 md:p-8">
            <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
              {/* Video Player */}
              <div className="relative bg-gray-900 aspect-video flex items-center justify-center group">
                {videos[activeVideoIndex].youtubeUrl ? (
                  <iframe
                    width="560"
                    height="315"
                    src={videos[activeVideoIndex].youtubeUrl}
                    title={videos[activeVideoIndex].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/40"></div>
                    <button className="relative z-10 bg-primary hover:bg-primary/90 text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                      <Play size={28} fill="currentColor" />
                    </button>

                    <div className="absolute bottom-6 left-6 text-white">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color.progress}`}>
                        {selectedCourse.emoji} {selectedCourse.level}
                      </span>
                      <h3 className="text-xl font-bold mt-2 drop-shadow-md">{videos[activeVideoIndex].title}</h3>
                    </div>

                    <div className="absolute bottom-6 right-6 flex space-x-2">
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <BookOpen size={14} />
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <Award size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-medium bg-accent px-3 py-1.5 rounded-full">
                    Video {activeVideoIndex + 1}/{videos.length}
                  </span>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${color.badge}`}>
                    {selectedCourse.level}
                  </span>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center">
                    <Clock size={12} className="mr-1" />
                    {videos[activeVideoIndex].duration.substring(3)}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-3">{videos[activeVideoIndex].title}</h2>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {activeVideoIndex === 0 ?
                    "Learn why investing in stocks is crucial for building wealth and achieving financial freedom. This video covers the basics of stock investments and how they can help you grow your money over time while outpacing inflation." :
                    "Explore the key concepts and strategies behind this important investing topic. You'll gain practical knowledge you can apply immediately to improve your investment results and build long-term wealth."
                  }
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                </div>

                <div className="flex flex-wrap items-center justify-between border-t border-border pt-6">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 px-4 py-2 rounded-full">
                      <Award size={16} className="mr-2" />
                      Take Quiz
                    </button>
                  </div>

                  <div className="flex items-center mt-4 md:mt-0">
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="bg-card border-t border-border p-4 flex justify-between sticky bottom-0">
            <button
              className={`flex items-center px-5 py-2.5 rounded-full transition-transform duration-200 hover:-translate-x-1 ${activeVideoIndex > 0 ? 'bg-accent hover:bg-accent/80 text-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
              disabled={activeVideoIndex === 0}
              onClick={() => activeVideoIndex > 0 && setActiveVideoIndex(activeVideoIndex - 1)}
            >
              <ChevronLeft size={16} className="mr-2" />
              Previous
            </button>

            <button
              className={`flex items-center px-5 py-2.5 rounded-full transition-transform duration-200 hover:translate-x-1 ${activeVideoIndex < videos.length - 1 ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
              disabled={activeVideoIndex === videos.length - 1}
              onClick={() => activeVideoIndex < videos.length - 1 && setActiveVideoIndex(activeVideoIndex + 1)}
            >
              Next
              <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnYard;