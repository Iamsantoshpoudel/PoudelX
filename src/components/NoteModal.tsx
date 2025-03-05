
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose }) => {
  const [noteContent, setNoteContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { currentUser, addNote, notes, deleteNote } = useChatStore();

  const MAX_CHARS = 20;

  // Check if user already has a note
  const userExistingNote = notes.find(note => note.creatorId === currentUser?.id);

  // Update character count when content changes
  useEffect(() => {
    setCharCount(noteContent.length);
  }, [noteContent]);

  const handleSaveNote = () => {
    if (noteContent.trim() && currentUser) {
      // If user already has a note, delete it first
      if (userExistingNote) {
        deleteNote(userExistingNote.id);
      }

      const newNote: Note = {
        id: uuidv4(),
        creatorId: currentUser.id,
        content: noteContent.trim(),
        createdAt: new Date().toISOString()
      };
      
      addNote(newNote);
      setNoteContent('');
      
      toast({
        title: "Note shared",
        description: "Your note has been shared with your friends"
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle>New note</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              
            </Button>
          </div>
        </DialogHeader>
        <div className="p-4">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder="What's on your mind?"
            className="min-h-[200px] border-0 focus-visible:ring-0 text-base p-0 resize-none"
          />
          <div className="text-xs text-right text-gray-500 mt-1">
            {charCount}/{MAX_CHARS}
          </div>
        </div>
        
        {noteContent.trim() && (
          <div className="p-4 flex items-center justify-center border-t border-gray-100">
            <div className="bg-gray-100 px-4 py-2 rounded-full text-sm inline-block">
              {noteContent.trim()}
            </div>
          </div>
        )}
        
        {currentUser && (
          <div className="flex flex-col items-center py-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gray-200 text-xl">
                {currentUser.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-gray-500 mt-2">
              Friends can see your note
            </div>
          </div>
        )}
        
        <DialogFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-500"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNote}
            disabled={!noteContent.trim()}
            className="bg-[#46C8B6] hover:bg-[#3baa9b] text-[#ffffff]"
          >
            {userExistingNote ? 'Update' : 'Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
