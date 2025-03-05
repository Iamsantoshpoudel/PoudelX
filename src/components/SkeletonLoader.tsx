
import React from 'react';

interface SkeletonLoaderProps {
  type: 'chat' | 'userList' | 'profile' | 'notes';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  const renderUserListSkeleton = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mr-2"></div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="mt-4 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Stories skeleton */}
      <div className="p-4 overflow-x-auto whitespace-nowrap border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="mt-1 h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat list skeleton */}
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatSkeleton = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header skeleton */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Messages skeleton */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`rounded-lg px-4 py-2 ${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-200'} animate-pulse`} 
                 style={{ width: `${100 + Math.random() * 100}px`, height: '36px' }}></div>
          </div>
        ))}
      </div>
      
      {/* Input skeleton */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-10 bg-gray-200 rounded-full flex-1 animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      
      <div className="space-y-3 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  const renderNotesSkeleton = () => (
    <div className="p-4 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex justify-between mt-4">
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  );

  switch (type) {
    case 'chat':
      return renderChatSkeleton();
    case 'userList':
      return renderUserListSkeleton();
    case 'profile':
      return renderProfileSkeleton();
    case 'notes':
      return renderNotesSkeleton();
    default:
      return null;
  }
};

export default SkeletonLoader;
