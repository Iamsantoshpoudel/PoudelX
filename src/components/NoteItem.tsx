
import React from 'react';
import { Note, User } from '@/lib/types';
import { useChatStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';

interface NoteItemProps {
  note: Note;
  onClick?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  compact?: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({ 
  note, 
  onClick, 
  showDelete = false, 
  onDelete,
  compact = false
}) => {
  const { onlineUsers, currentUser } = useChatStore();
  
  const creator = onlineUsers.find(user => user.id === note.creatorId);
  const isOwnNote = note.creatorId === currentUser?.id;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };
  
  if (compact) {
    // Compact version for the top story/note section
    return (
      <div 
        className="flex flex-col items-center cursor-pointer relative max-w-[70px]"
        onClick={onClick}
      >
        <div 
          className="mb-1 bg-white p-2 rounded-lg shadow-sm border border-gray-200 text-xs w-[70px] h-[40px] overflow-hidden"
        >
          <div className="h-full overflow-y-hidden break-words text-[10px] line-clamp-3">
            {note.content}
          </div>
        </div>
        <div className="relative">
          <Avatar className="w-14 h-14 border-2 border-blue-500">
            <AvatarFallback className="bg-gray-200 text-sm">
              {creator?.name[0] || '?'}
            </AvatarFallback>
          </Avatar>
          {creator?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          )}
          {showDelete && isOwnNote && (
            <button 
              className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow hover:shadow-md transition-shadow"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          )}
        </div>
        <span className="text-xs mt-1 w-full text-center truncate">
          {creator?.name || 'User'}
        </span>
      </div>
    );
  }
  
  // Regular note view (for detail modal trigger)
  return (
    <div 
      className="flex flex-col shadow-sm rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative bg-white"
      style={{ 
        width: "100%",
        maxWidth: "300px"
      }}
      onClick={onClick}
    >
      <div className="p-3 flex-1 overflow-hidden">
        <div className="text-sm font-medium break-words whitespace-pre-wrap max-h-[200px] overflow-y-auto">
          {note.content}
        </div>
      </div>
      <div className="px-3 pb-2 flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-gray-200 text-xs">
                {creator?.name[0] || '?'}
              </AvatarFallback>
            </Avatar>
            {creator?.isOnline && (
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {creator?.name || 'User'}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
        </div>
      </div>
      
      {showDelete && isOwnNote && (
        <button 
          className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-70 hover:opacity-100 transition-opacity shadow-sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default NoteItem;
