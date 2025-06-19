import React from 'react';
import { assets } from '../assets/assets';
import Image from 'next/image';

const Message = ({ role, message }) => {
  const isUser = role === 'user';

  return (
    <div className="flex items-center flex-col w-full max-w-3xl text-sm">
      <div className={`flex flex-col w-full mb-8 ${isUser ? 'items-end' : ''}`}>
        <div className={`group relative flex max-w-2xl py-3 rounded-xl ${isUser ? 'bg-[#414158] px-5' : 'gap-3'}`}>
          
          {/* Hover Icons */}
          <div
            className={`
              opacity-0 group-hover:opacity-100 transition-all absolute
              ${isUser ? '-left-16 top-2.5' : 'left-9 -bottom-6'}
            `}
          >
            <div className="flex items-center gap-2 opacity-70">
              {isUser ? (
                <>
                  <Image src={assets.copy_icon} alt="copy" className="w-4 cursor-pointer" />
                  <Image src={assets.pencil_icon} alt="edit" className="w-4 cursor-pointer" />
                </>
              ) : (
                <>
                  <Image src={assets.pencil_icon} alt="edit" className="w-4 cursor-pointer" />
                  <Image src={assets.regenerate_icon} alt="regenerate" className="w-4 cursor-pointer" />
                   <Image src={assets.dislike_icon} alt="dislike" className="w-4 cursor-pointer" />
                  <Image src={assets.like_icon} alt="dislike" className="w-4 cursor-pointer" />
                 
                </>
              )}
            </div>
          </div>

          {/* Message Content */}
          {isUser ? (
            <span className="text-white/90">{message}</span>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt="bot logo"
                className="w-9 h-9 p-1 border border-white/15 rounded-full"
              />
              <div className="space-y-4 w-full text-white/80">{message}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
