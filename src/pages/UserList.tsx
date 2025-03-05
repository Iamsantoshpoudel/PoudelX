import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { User, Note } from '@/lib/types';
import { Search, PlusCircle, FileText, Plus, Trash2 } from 'lucide-react';
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

  const onlineUsersFiltered = onlineUsers.filter(user => 
    user.id !== currentUser?.id && 
    user.isOnline
  );
  {/* handle note  */}
  const myNote = notes
    .filter(note => note.creatorId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  
  const otherUsersNotes = notes
    .filter(note => note.creatorId !== currentUser?.id)
    .reduce((acc: Note[], note) => {
      const existingNote = acc.find(n => n.creatorId === note.creatorId);
      if (!existingNote) {
        acc.push(note);
      } else if (new Date(note.createdAt).getTime() > new Date(existingNote.createdAt).getTime()) {
        const index = acc.findIndex(n => n.creatorId === note.creatorId);
        acc[index] = note;
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredAndSortedUsers = onlineUsers
    .filter(user => 
      user.id !== currentUser?.id && 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
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
      <div className="p-4 border-b border-border">
        <div className="flex items-center">
          <img 
            src="/Logo.svg" 
            alt="Logo" 
            className="w-8 h-8 mr-2"
          />
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full bg-muted/50"
          />
        </div>
      </div>

      <div className="p-4 pt-8 overflow-x-auto whitespace-nowrap border-b border-gray-200">
        <div className="flex space-x-4">
          {currentUser && (
            <div className="flex flex-col items-center cursor-pointer relative mt-8">
              {myNote && (
                <div 
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-200 text-xs max-w-[180px] flex items-center gap-1"
                  onClick={() => handleNoteClick(myNote)}
                >
                  <span className="truncate">
                    {myNote.content}
                  </span>
                  <Trash2 
                    className="h-3.5 w-3.5 text-gray-400 hover:text-red-500 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(myNote.id);
                    }}
                  />
                </div>
              )}
              
              {!myNote && (
                <div 
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-200 text-xs text-gray-400"
                  onClick={handleOpenNoteModal}
                >
                  Share a thought...
                </div>
              )}
              
              <div className="relative">
                <Avatar className="w-14 h-14 border border-gray-200">
                  <AvatarFallback className="bg-gray-200 text-lg">
                    {currentUser.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  onClick={handleOpenNoteModal} 
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#46C8B6]" />
                </div>
              </div>
              <div className="text-xs mt-1 text-gray-500 max-w-[70px] truncate">
                {myNote ? "My Notes" : "Create Note"}
              </div>
            </div>
          )}

          {otherUsersNotes.map(note => {
            const noteCreator = onlineUsers.find(user => user.id === note.creatorId);
            return (
              <div
                key={note.id}
                className="flex flex-col items-center cursor-pointer relative mt-8"
                onClick={() => handleNoteClick(note)}
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-200 text-xs max-w-[150px] truncate">
                  {note.content}
                </div>
                
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-gray-200 text-lg">
                      {noteCreator?.name[0].toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  {noteCreator?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="text-xs mt-1 max-w-[60px] truncate">{noteCreator?.name || 'User'}</span>
              </div>
            );
          })}

          {onlineUsersFiltered.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="relative">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-gray-200 text-lg">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <span className="text-xs mt-1 max-w-[60px] truncate">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedUsers.map((user) => {
          const lastMessage = getLastMessage(user.id);
          const unreadCount = getUnreadCount(user.id);
          
          return (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gray-200">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
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
                </div>
                {unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#46C8B6] text-white text-xs flex items-center justify-center">
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
