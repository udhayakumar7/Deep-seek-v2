import Image from 'next/image'
import React, { useState } from 'react'
import { assets } from '../assets/assets'

const PromptBox = ({isLoading, setLoading}) => {

    const [prompt, setPromt] = useState('')

  return (
    <form className={` w-full ${false ? 'max-w-3xl' : 'max-w-2xl'} bg-[#404045] p-4 rounded-3xl transition-all`} action="">

        <textarea name="" id="" className=' outline-none w-full  resize-none overflow-hidden break-words bg-transparent ' rows={2}
         placeholder='Message DeepSeek' required onChange={(e)=> setPromt(e.target.value)} value={prompt}
        ></textarea>
        <div className=' flex items-center justify-between text-sm '>
            <div className='flex items-center gap-2'>
                <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition-all'>
                    <Image src={assets.deepthink_icon}  alt=''/> DeepThink (R1)
                </p>
                 <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition-all'>
                    <Image src={assets.search_icon}  alt=''/> Search
                </p>
            </div>
            <div className='flex items-center gap-2'>
                <Image className='w-4 cursor-pointer' src={assets.pin_icon}  alt=''/>
                <button className={`${prompt ? 'bg-primary': 'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}>
                    <Image className='w-4 cursor-pointer' src={ prompt ? assets.arrow_icon : assets.search_icon}  alt=''/>
                </button>
            </div>


        </div>


    </form>
  )
}

export default PromptBox