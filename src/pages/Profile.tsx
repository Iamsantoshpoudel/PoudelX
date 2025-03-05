
import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import UserProfile from '@/components/UserProfile';
import Loader from '@/components/Loader';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, onlineUsers } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(currentUser);
  const { id } = useParams();
  const navigate = useNavigate();

  // Determine which user profile to show based on the URL parameter
  useEffect(() => {
    if (id) {
      // Show another user's profile
      const foundUser = onlineUsers.find(user => user.id === id);
      if (foundUser) {
        setProfileUser(foundUser);
      } else {
        // If user not found, redirect to own profile
        navigate('/profile');
      }
    } else {
      // Show current user's own profile
      setProfileUser(currentUser);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, currentUser, onlineUsers, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full overflow-auto">
      {profileUser && (
        <UserProfile 
          user={profileUser} 
          showBackButton={!!id} 
          onBack={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default Profile;
