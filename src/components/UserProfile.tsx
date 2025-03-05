
import { User } from '@/lib/types';
import { Button } from './ui/button';
import { ChevronLeft, Mail, Lock, LogOut } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';
import { useChatStore } from '@/lib/store';
import { updateUserStatus } from '@/lib/firebase';
import { toast } from './ui/use-toast';
import { getAuth, updateEmail, updatePassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: User;
  showBackButton?: boolean;
  onBack?: () => void;
}

const UserProfile = ({ user, showBackButton, onBack }: UserProfileProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setCurrentUser, currentUser } = useChatStore();
  const isOwnProfile = currentUser?.id === user.id;
  const auth = getAuth();

  const handleSave = async () => {
    try {
      // Validate password confirmation if password is being changed
      if (password.trim() && password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update name
      const updatedUser = {
        ...user,
        name: name.trim(),
        email: email.trim()
      };

      await updateUserStatus(updatedUser);
      setCurrentUser(updatedUser);
      
      // Update email if changed and user is authenticated
      if (auth.currentUser && email !== user.email && email.trim()) {
        await updateEmail(auth.currentUser, email.trim());
      }
      
      // Update password if provided
      if (auth.currentUser && password.trim()) {
        await updatePassword(auth.currentUser, password.trim());
        setPassword(''); // Clear password field after update
        setConfirmPassword(''); // Clear confirm password field
      }
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear user from store
      setCurrentUser({
        id: '',
        name: '',
        isOnline: false,
        lastSeen: new Date().toISOString()
      });
      
      // Clear user data from session storage
      sessionStorage.removeItem('currentUser');
      
      // Clear user data from cookies
      document.cookie = 'currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Navigate to landing page
      navigate('/');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full bg-white select-none">
      {showBackButton && (
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-3xl">
            {user.name[0].toUpperCase()}
          </div>
          <div className="text-center space-y-1">
            {isOwnProfile && isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center"
                placeholder="Enter your name"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user.name}</h2>
            )}
            <p className="text-gray-500">
              {user.isOnline ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>

        {isOwnProfile && (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retype new password"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                      setEmail(user.email || '');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-[#46C8B6] hover:bg-[#3baa9b]"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="email"
                      value={user.email || ''}
                      readOnly
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#46C8B6] hover:bg-[#3baa9b] text-white" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
