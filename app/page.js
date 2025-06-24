'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { assets } from './assets/assets';
import SideBar from './components/SideBar';
import PromptBox from './components/PromtBox';
import Message from './components/Message';
import { useAppContext } from './context/AppContext';

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const { selectedChat } = useAppContext();

  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessage(selectedChat.messages || []);
      console.log('Setting message from selectedChat:', selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [message]);



  return (
    <div>
      <div className="flex h-screen">
        <SideBar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          {/* Top mobile menu */}
          <div className="md:hidden absolute px-4 top-6 flex justify-between items-center w-full">
            <Image
              onClick={() => setExpand(!expand)}
              className="rotate-180"
              src={assets.menu_icon}
              alt="menu-icon"
            />
            <Image src={assets.chat_icon} alt="chat-icon" />
          </div>

          {/* Conditional UI */}
          {message.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="logo" className="h-16" />
                <p className="text-2xl font-medium">Hi, I'm DeepSeek</p>
              </div>
              <p className="text-sm mt-2 pb-8">How can I help you today?</p>
            </>
          ) : (
            <div
              ref={containerRef}
              className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto pb-8"
            >
              {/* {console.log('Rendering messages:', message)} */}
              <p className='fixed top-8 border border-transparent hover:bg-gray-500/50 px-2 rounded-lg font-semibold mb-8 cursor-pointer'>
              {selectedChat.name || 'Chat'}
              </p>

              {message.map((msg, index) => (
                <Message key={index} role={msg.role} message={msg.content} />
              ))}

              {isloading && (
                <div className="flex gap-4 max-w-3xl justify-start w-full py-3">
                  <Image
                    src={assets.logo_icon}
                    alt="loading"
                    className="w-9 h-9 border-white/15 rounded-full"
                  />
                  <div className="loader flex items-center justify-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce" />
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce" />
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input */}
          <PromptBox isloading={isloading} setLoading={setIsLoading} />

          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference Only
          </p>
        </div>
      </div>
    </div>
  );
}
