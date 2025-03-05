
import { MessageCircle, User, Users } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '@/lib/store';
import { useEffect } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useChatStore();
  
  // Determine active tab based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/chat')) return 'chat';
    if (path.startsWith('/userlist')) return 'userlist';
    if (path.startsWith('/profile')) return 'profile';
    return '';
  };
  
  const activeTab = getActiveTab();

  // Redirect to userlist if directly accessing /
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/userlist');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="h-screen flex flex-col select-none bg-white">
      <div className="flex-1 overflow-hidden pb-16">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around">
          <button
            onClick={() => navigate('/userlist')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'userlist' ? 'text-[#46C8B6]' : 'text-gray-600'
            }`}
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Chats</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'chat' ? 'text-[#46C8B6]' : 'text-gray-600'
            }`}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'profile' ? 'text-[#46C8B6]' : 'text-gray-600'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
