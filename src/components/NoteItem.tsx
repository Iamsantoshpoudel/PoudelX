
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
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onClick, showDelete = false, onDelete }) => {
  const { onlineUsers, currentUser } = useChatStore();
  
  const creator = onlineUsers.find(user => user.id === note.creatorId);
  const isOwnNote = note.creatorId === currentUser?.id;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };
  
  return (
    <div 
      className="flex flex-col min-w-[120px] max-w-[180px] shadow-sm rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={onClick}
    >
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium line-clamp-2">{note.content}</div>
      </div>
      <div className="p-2 flex items-center space-x-1">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-gray-200 text-xs">
            {creator?.name[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500 truncate">
          {creator?.name || 'User'}
        </div>
      </div>
      <div className="px-2 pb-2 text-xs text-gray-400">
        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
      </div>
      
      {showDelete && isOwnNote && (
        <button 
          className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-70 hover:opacity-100 transition-opacity"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default NoteItem;
