
import React from 'react';

interface LoaderProps {
  type?: "spinner" | "skeleton";
  skeletonType?: "userList" | "chat" | "profile";
}

const Loader: React.FC<LoaderProps> = ({ type = "spinner", skeletonType = "userList" }) => {
  if (type === "skeleton") {
    switch (skeletonType) {
      case "userList":
        return (
          <div className="h-full flex flex-col animate-pulse">
            {/* Header skeleton */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4 h-10 bg-gray-200 rounded-md w-full"></div>
            </div>
            
            {/* Story/Online users skeleton */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-4 overflow-x-auto">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                    <div className="mt-1 w-10 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat list skeleton */}
            <div className="flex-1 overflow-y-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-4 border-b border-gray-100 flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "chat":
        return (
          <div className="h-full flex flex-col animate-pulse">
            {/* Header skeleton */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
            </div>
            
            {/* Messages skeleton */}
            <div className="flex-1 p-4 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`rounded-lg p-3 max-w-[80%] ${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`} style={{width: `${Math.floor(Math.random() * 40) + 40}%`, height: '40px'}}></div>
                </div>
              ))}
            </div>
            
            {/* Input skeleton */}
            <div className="p-4 border-t border-gray-200">
              <div className="h-12 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        );
        
      case "profile":
        return (
          <div className="h-full animate-pulse">
            <div className="p-4 border-b border-gray-200">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                <div className="text-center space-y-1">
                  <div className="h-6 w-32 bg-gray-200 rounded mx-auto"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-12 w-full bg-gray-200 rounded"></div>
                <div className="h-12 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
        );
    }
  }
  
  // Default spinner
  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default Loader;
