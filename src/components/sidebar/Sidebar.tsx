import { useState } from "react"
import Menubar from "./Menubar"
import Profile from "../Profile"
import Messages from "../../pages/Messages"
interface Props {
  onSelectUser: (userId: string, userName?: string,profile?:string) => void;
}

const Sidebar: React.FC<Props> = ({ onSelectUser }) => {
  const [activeTab,setActiveTab] = useState('messages')
  return (
    <div className="w-full flex h-full bg-[#111b21]">
         <div className="w-2/12">
            <Menubar setActiveTab={setActiveTab} activeTab={activeTab}/>
         </div>
         <div className="flex-1 py-10 px-6 text-white">
           {
            activeTab === 'profile' && <Profile/>
           }
           {
            activeTab === 'messages' && <Messages onSelectUser={onSelectUser} />
           }
         </div>
    </div>
  )
}

export default Sidebar