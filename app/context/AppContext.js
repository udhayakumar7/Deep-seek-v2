'use client';
import { useUser, useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // ✅ Create a new chat and return it
  const createNewChat = async () => {
    try {
      if (!user) return null;

      const token = await getToken();
      const res = await axios.post(
        '/api/chat/create',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.success && res.data.data) {
        console.log('✅ Chat created:', res.data.data);
        return res.data.data;
      } else {
        console.warn('⚠️ Chat creation response malformed:', res.data);
        return null;
      }
    } catch (error) {
      console.error('❌ Error creating new chat:', error.response?.data || error);
      return null;
    }
  };

  // ✅ Fetch chats, create one if none exist
  const fetchUserChats = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      const { data } = await axios.get('/api/chat/get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let chatList = data.success ? data.data : [];

      // 🟨 If no chats, create one
      if (chatList.length === 0) {
        const newChat = await createNewChat();
        if (newChat) {
          chatList = [newChat];
        } else {
          console.error('❌ Could not create a new chat for new user.');
          return;
        }
      }

      // 🟩 Sort and select latest
      chatList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setChats(chatList);
      setSelectedChat(chatList[0]);
      console.log('✅ Fetched chats:', chatList);
    } catch (error) {
      console.error('❌ Error fetching chats:', error.response?.data || error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    fetchUserChats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
