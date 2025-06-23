'use client'
import { useUser, useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react'


export const AppContext = createContext ();


export const useAppContext = () => {
    return  useContext(AppContext);
    
}

export const  AppContextProvider = ({children}) =>{
    const {user} = useUser();

    const {getToken} = useAuth();

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const  createNewChat = async () => {

        try{

             if(!user) return null;

             const token = await getToken();

            await axios.post('/api/chat/create', {}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
             fetchUserChats()

        } catch (error) {
            console.error("Error creating new chat:", error);
        }

    }

    const fetchUserChats = async () => {
        try {
            if (!user) return;

            const token = await getToken();
            const {data} = await axios.get('/api/chat/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(data.success) {
                setChats(data.data);
                console.log("Fetched chats:", data.data);

                if(data.data.length === 0) {
                    await createNewChat();
                    return fetchUserChats()
                }
                else{
                    data.data.sort((a, b) => {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                    });
                    setSelectedChat(data.data[0]);
                }
            }
            else {
                console.error("Failed to fetch chats:", data.message);
            }

        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    }

    
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
        fetchUserChats
    }




    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}