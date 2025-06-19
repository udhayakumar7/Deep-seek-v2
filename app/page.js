'use client'
import Image from "next/image";
import { useState } from "react";
import { assets } from "./assets/assets";
import SideBar from "./components/SideBar";
import PromptBox from "./components/PromtBox";
import Message from "./components/Message";


export default function Home() {

  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  return (
     <div>
      <div className="flex h-screen">

       <SideBar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4  pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden  absolute px-4  top-6  flex justify-between items-center w-full">
            <Image onClick={(e)=>(expand ? setExpand(false): setExpand(true))} className="rotate-180" src={assets.menu_icon} alt="menu-icon" />
            <Image className="" src={assets.chat_icon} alt="menu-icon" />
          </div>

          {
          message.length !== 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="logo" className="h-16" />
                <p className="text-2xl  font-medium">Hi, I'm DeepSeek</p>
              </div>
              <p className="text-sm mt-2 ">How can I help you today?</p>
            </>
          ): 
          (
             <Message role={'user'} message={'What is nextjs?'} />
          )
        }
       
          <PromptBox isloading={isloading} setIsLoading={setIsLoading} />

          <p className="text-xs absolute bottom-1 text-gray-500 ">AI-generated, for reference Only </p>
        

        </div>
     


      </div>

     </div>
  );
}
