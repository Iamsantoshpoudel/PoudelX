
import { useEffect, useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import { useChatStore } from '@/lib/store';
import { updateUserStatus } from '@/lib/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/Loader';

const Chat = () => {
  const { currentUser, selectedUser, setSelectedUser } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Set selected user based on URL param
  useEffect(() => {
    if (id && currentUser) {
      const user = useChatStore.getState().onlineUsers.find(u => u.id === id);
      if (user) {
        setSelectedUser(user);
      } else {
        navigate('/userlist');
      }
    } else if (!id && selectedUser) {
      setSelectedUser(null);
      navigate('/userlist');
    }
  }, [id, currentUser, setSelectedUser, navigate, selectedUser]);

  // Handle user status updates
  useEffect(() => {
    if (currentUser) {
      updateUserStatus({
        ...currentUser,
        isOnline: true,
        lastSeen: new Date().toISOString()
      });

      const handleBeforeUnload = () => {
        updateUserStatus({
          ...currentUser,
          isOnline: false,
          lastSeen: new Date().toISOString()
        });
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        handleBeforeUnload();
      };
    }
  }, [currentUser]);

  if (isLoading) {
    return <Loader />;
  }

  const handleViewProfile = () => {
    if (selectedUser) {
      navigate(`/profile/${selectedUser.id}`);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <ChatWindow 
        showBackButton={true} 
        onBack={() => {
          setSelectedUser(null);
          navigate('/userlist');
        }}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};

export default Chat;
