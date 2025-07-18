import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar"
import ChatWindow from "./ChatWindow"

const Home = () => {
    const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name?: string;
    profile?: string;
  } | null>(null);
  return (
<div className="w-full flex items-center justify-center h-screen overflow-auto bg-neutral-900">
  <div className="flex w-full h-full justify-start ">
    {/* Sidebar (no fixed) */}
    <div className="w-4/12 h-screen border-r border-gray-700">
      <Sidebar onSelectUser={(id, name, profile) => setSelectedUser({ id, name, profile })} />
    </div>

    {/* Chat Window or placeholder */}
    <div className="flex-1 h-screen w-full">
      {selectedUser ? (
        <ChatWindow
          receiverId={selectedUser.id}
          receiverName={selectedUser.name}
          recieverProfile={selectedUser.profile}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  </div>
</div>

  )
}

export default Home