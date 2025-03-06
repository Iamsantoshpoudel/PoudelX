
import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { User, Note } from '@/lib/types';
import { Search, PlusCircle, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader';
import NoteModal from '@/components/NoteModal';
import NoteItem from '@/components/NoteItem';
import NoteDetailModal from '@/components/NoteDetailModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';



const UserList = () => {
  const { onlineUsers, currentUser, messages, notes, deleteNote } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getLastMessage = (userId: string) => {
    return messages
      .filter(m => (m.senderId === userId && m.receiverId === currentUser?.id) || 
                   (m.senderId === currentUser?.id && m.receiverId === userId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getUnreadCount = (userId: string): number => {
    return messages.filter(m => 
      m.senderId === userId && 
      m.receiverId === currentUser?.id && 
      !m.isRead
    ).length;
  };

  const handleUserClick = (user: User) => {
    if (user.id === currentUser?.id) return;
    navigate(`/chat/${user.id}`);
  };

  const handleOpenNoteModal = () => {
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleCloseNoteDetail = () => {
    setSelectedNote(null);
  };
  
  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully",
    });
    setSelectedNote(null);
  };

  const myNote = notes
    .filter(note => note.creatorId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  
  const userNotesMap = new Map<string, Note>();
  
  notes.forEach(note => {
    if (note.creatorId === currentUser?.id) return;
    
    const existingNote = userNotesMap.get(note.creatorId);
    if (!existingNote || new Date(note.createdAt) > new Date(existingNote.createdAt)) {
      userNotesMap.set(note.creatorId, note);
    }
  });

  const filteredAndSortedUsers = onlineUsers
    .filter(user => 
      user.id !== currentUser?.id && 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      
      const aLastMessage = getLastMessage(a.id);
      const bLastMessage = getLastMessage(b.id);
      
      if (!aLastMessage && !bLastMessage) return 0;
      if (!aLastMessage) return 1;
      if (!bLastMessage) return -1;
      
      return new Date(bLastMessage.timestamp).getTime() - new Date(aLastMessage.timestamp).getTime();
    });

  if (isLoading) {
    return <Loader type="skeleton" skeletonType="userList" />;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 pb-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/Logo.svg" alt="Logo" className="h-8 w-auto" />
          <h3 className="text-xl font-semibold pl-[8px]">Poudel X</h3>
        </div>
        <div className="flex space-x-3">
          {/* You can add menu buttons here if needed */}
          
        </div>
      </div>
      
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full bg-gray-100 border-none rounded-full"
          />
        </div>
      </div>

      <div className="px-4 pb-4 overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-4 items-end">
          <div className="flex flex-col items-center cursor-pointer relative max-w-[70px]" onClick={handleOpenNoteModal}>
            <div className="mb-1 bg-gray-100 p-2 rounded-lg w-[70px] h-[40px] flex items-center justify-center">
              <span className="text-xs text-gray-500">Create</span>
            </div>
            <div className="relative">
              <Avatar className="w-14 h-14 bg-gray-200 border-2 border-white">
                <AvatarFallback className="text-sm">
                  {currentUser?.name[0].toUpperCase() || "+"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0 -right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                <Plus className="h-4 w-4" />
              </div>
            </div>
            <span className="text-xs mt-1 w-full text-center truncate">
              Create story
            </span>
          </div>

          {myNote && (
            <NoteItem 
              note={myNote} 
              onClick={() => handleNoteClick(myNote)} 
              showDelete={true}
              onDelete={() => handleDeleteNote(myNote.id)}
              compact={true}
            />
          )}

          {filteredAndSortedUsers
            .filter(user => userNotesMap.has(user.id) || user.isOnline)
            .slice(0, 10)
            .map((user) => {
              const userNote = userNotesMap.get(user.id);
              
              if (userNote) {
                return (
                  <NoteItem 
                    key={user.id}
                    note={userNote}
                    onClick={() => handleNoteClick(userNote)}
                    compact={true}
                  />
                );
              }

              return (
                <div key={user.id} className="flex flex-col items-center relative max-w-[70px]" onClick={() => handleUserClick(user)}>
                  <div className="mb-1 bg-transparent p-2 rounded-lg w-[70px] h-[40px] invisible">
                    <span className="text-xs text-transparent">Placeholder</span>
                  </div>
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-gray-200">
                      <AvatarFallback className="bg-gray-200 text-sm">
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <span className="text-xs mt-1 w-full text-center truncate">
                    {user.name}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="h-px bg-gray-200 mx-2 mb-1"></div>

      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedUsers.map((user) => {
          const lastMessage = getLastMessage(user.id);
          const unreadCount = getUnreadCount(user.id);
          const userNote = userNotesMap.get(user.id);
          
          return (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gray-200">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`font-medium truncate ${unreadCount > 0 ? 'text-black' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className={`text-sm truncate ${
                      unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                    }`}>
                      {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                      {lastMessage.content}
                    </p>
                  )}
                  {!lastMessage && userNote && (
                    <p className="text-sm text-blue-500 truncate">
                      Has shared a note
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <NoteModal isOpen={isNoteModalOpen} onClose={handleCloseNoteModal} />
      <NoteDetailModal 
        note={selectedNote} 
        isOpen={selectedNote !== null} 
        onClose={handleCloseNoteDetail}
        onDelete={() => selectedNote && handleDeleteNote(selectedNote.id)}
      />
    </div>
  );
};

export default UserList;
