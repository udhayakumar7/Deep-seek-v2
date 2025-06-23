import Image from 'next/image';
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const PromptBox = ({ isLoading, setLoading }) => {
  const [prompt, setPromt] = useState('');
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt;

    try {
      e.preventDefault();

      if (!user) return console.error('User not authenticated');
      if (!selectedChat || !selectedChat._id)
        return console.error('No chat selected');
      if (isLoading) return console.error('Already sending a prompt');

      setLoading(true);
      setPromt('');

      const userPrompt = {
        role: 'user',
        content: prompt,
        time: Date.now(),
      };

      // Optimistically update local state
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userPrompt] }
            : chat
        )
      );

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, userPrompt],
      }));

      // Send prompt to backend
      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt,
      });

      if (data.success) {
        const fullMessage = data.data.content;
        const tokens = fullMessage.split(' ');

        let assistantMessage = {
          role: 'assistant',
          content: '',
          time: Date.now(),
        };

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        );

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        for (let i = 0; i < tokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = tokens.slice(0, i + 1).join(' ');
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];
              return {
                ...prev,
                messages: updatedMessages,
              };
            });
          }, i * 50); // animation speed
        }
      } else {
        console.error('Error sending prompt:', data.error);
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
      setPromt(promptCopy);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full max-w-2xl bg-[#404045] p-4 rounded-3xl transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message Gemini"
        required
        onChange={(e) => setPromt(e.target.value)}
        value={prompt}
        disabled={!selectedChat}
      ></textarea>

      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition-all">
            <Image src={assets.deepthink_icon} alt="" /> Gemini AI
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition-all">
            <Image src={assets.search_icon} alt="" /> Search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            disabled={!prompt}
            type="submit"
            className={`${
              prompt ? 'bg-primary' : 'bg-[#71717a]'
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-4"
              src={prompt ? assets.arrow_icon : assets.search_icon}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
