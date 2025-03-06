
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { Note } from '@/lib/types';
import { useChatStore } from '@/lib/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ note, isOpen, onClose, onDelete }) => {
  const { onlineUsers, currentUser } = useChatStore();
  
  if (!note) return null;
  
  const creator = onlineUsers.find(user => user.id === note.creatorId);
  const isOwnNote = note.creatorId === currentUser?.id;
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 max-h-[90vh] rounded-xl">
        <DialogHeader className="p-4 border-b border-gray-100 flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback className="bg-gray-200">
                  {creator?.name[0] || '?'}
                </AvatarFallback>
              </Avatar>
              {creator?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base">{creator?.name || 'User'}</DialogTitle>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isOwnNote && onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete} 
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4 overflow-y-auto">
          <div className="p-4 bg-gray-50 rounded-xl max-h-[60vh] overflow-y-auto">
            <p className="whitespace-pre-wrap break-words text-base">
              {note.content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailModal;
