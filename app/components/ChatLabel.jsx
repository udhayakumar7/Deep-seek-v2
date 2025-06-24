import Image from "next/image";
import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
  const { fetchUserChats, chats, setSelectedChat } = useAppContext();

  const selectChat = () => {
    // Ensure id is string for reliable matching
    const chatData = chats.find((chat) => String(chat._id) === String(id));
    
    if (chatData) {
      setSelectedChat(chatData);
      console.log("✅ Selected chat:", chatData);
    } else {
      console.error("❌ Chat not found with ID:", id);
      console.log("🔍 Available chat IDs:", chats.map(c => c._id));
    }
  };

  const renameHandler = async () => {
    try {
      const newName = prompt("Enter new chat name");
      if (!newName) return;

      const { data } = await axios.post("/api/chat/rename", {
        chatId: id,
        name: newName,
      });

      if (data.success) {
        await fetchUserChats();
        setOpenMenu({ id: 0, open: false });
      } else {
        console.error("❌ Failed to rename chat:", data.error);
      }
    } catch (err) {
      console.error("❌ Error renaming chat:", err);
    }
  };

  const deleteHandler = async () => {
    try {
      const confirmDelete = confirm("Are you sure you want to delete this chat?");
      if (!confirmDelete) return;

      const { data } = await axios.post("/api/chat/delete", {
        chatId: id,
      });

      if (data.success) {
        await fetchUserChats();
        setOpenMenu({ id: 0, open: false });
      } else {
        console.error("❌ Failed to delete chat:", data.error);
      }
    } catch (err) {
      console.error("❌ Error deleting chat:", err);
    }
  };

  return (
    <div
      onClick={selectChat}
      className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
    >
      <p className="truncate max-w-[80%]">{name}</p>

      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu({ id: id, open: !openMenu.open });
        }}
        className="relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
      >
        <Image
          src={assets.three_dots}
          alt="three-dots"
          className={`w-4 ${openMenu.id === id && openMenu.open ? "" : "hidden"} group-hover:block`}
        />

        <div
          className={`absolute ${
            openMenu.id === id && openMenu.open ? "block" : "hidden"
          } -right-36 top-6 bg-gray-700 rounded-xl w-max p-2`}
        >
          <div
            onClick={renameHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <Image src={assets.pencil_icon} alt="rename-icon" className="w-4" />
            <p>Rename</p>
          </div>

          <div
            onClick={deleteHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <Image src={assets.delete_icon} alt="delete-icon" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;
