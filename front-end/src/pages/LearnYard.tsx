import React, { useState } from 'react';
import { Play, ChevronLeft, Clock, CheckCircle, BookOpen, Award, Users, ChevronRight, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Video {
  title: string;
  duration: string;
  completed?: boolean;
}

const LearnYard: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const videos: Video[] = [
    { title: 'Why should you Invest?', duration: '00:08:25', completed: true },
    { title: 'Market Intermediaries', duration: '00:08:58' },
    { title: 'All about the Initial Public Offer (IPO)', duration: '00:08:07' },
    { title: 'Why do stock prices fluctuate?', duration: '00:03:51' },
    { title: 'How does a trading platform work?', duration: '00:07:07' },
    { title: 'Stock Market Index', duration: '00:07:09' },
  ];

  const progress = Math.round(((videos.filter(v => v.completed).length) / videos.length) * 100);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-card  px-6 py-4 flex justify-end items-center mt-16">
        
        
      </div>

      {/* Title Bar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Module 1: Introduction to Stock Market</h1>
      
        <div className="flex items-center mt-2">
          <div className="w-full max-w-md bg-muted rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-muted-foreground">{progress}% complete</span>
          <a href="#" className="ml-auto text-primary hover:text-primary/80 flex items-center text-sm font-medium">
  <ChevronLeft size={16} className="mr-1" />
  Back to all modules
</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-1/3 max-w-md bg-card border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground">Course Content</h3>
              <p className="text-sm text-muted-foreground">{videos.length} videos • Total {videos.reduce((acc, video) => {
                const [min, sec] = video.duration.split(':').slice(1);
                return acc + parseInt(min) * 60 + parseInt(sec);
              }, 0) / 60} minutes</p>
            </div>
            
            <div className="divide-y divide-border">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-accent ${activeVideoIndex === index ? 'bg-accent border-l-4 border-primary' : ''}`}
                  onClick={() => setActiveVideoIndex(index)}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${video.completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                      {video.completed ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${activeVideoIndex === index ? 'text-primary' : 'text-foreground'}`}>{video.title}</h4>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Clock size={14} className="mr-1" />
                        <span>{video.duration.substring(3)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-6">
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              {/* Video Player */}
              <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
                <button className="relative z-10 bg-primary hover:bg-primary/90 text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110">
                  <Play size={28} fill="currentColor" />
                </button>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-primary px-3 py-1 rounded-full text-xs font-medium">Module 1</span>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full mr-2">Video {activeVideoIndex + 1}/{videos.length}</span>
                  <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">Beginner</span>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-2">{videos[activeVideoIndex].title}</h2>
                
                <p className="text-muted-foreground mb-6">
                  Learn why investing in stocks is important for building wealth and achieving financial freedom. This video covers the basics of stock investments and how they can help you grow your money over time.
                </p>
                
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80">
                      <BookOpen size={16} className="mr-1" />
                      Resources
                    </button>
                    <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80">
                      <Award size={16} className="mr-1" />
                      Quiz
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <Users size={16} className="text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">365K+ views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="bg-card border-t border-border p-4 flex justify-between">
            <button 
              className={`flex items-center px-4 py-2 rounded-md ${activeVideoIndex > 0 ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
              disabled={activeVideoIndex === 0}
              onClick={() => activeVideoIndex > 0 && setActiveVideoIndex(activeVideoIndex - 1)}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            
            <button 
              className={`flex items-center px-4 py-2 rounded-md ${activeVideoIndex < videos.length - 1 ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
              disabled={activeVideoIndex === videos.length - 1}
              onClick={() => activeVideoIndex < videos.length - 1 && setActiveVideoIndex(activeVideoIndex + 1)}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnYard;