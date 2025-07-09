import {BookOpen, Images, MessageSquare, Settings} from 'lucide-react'
import Avatar from '../Avatar'
import { useAuthContext } from '../../context/AuthContext'
import Tooltip from '../Tooltip'
const Menubar = ({setActiveTab,activeTab}) => {
    const {authUser} = useAuthContext()
    console.log(authUser)
  return (
<div className="w-full flex flex-col justify-between h-full items-center p-2 py-10 bg-[#202c33] text-gray-50">
  <div className="flex flex-col gap-10">
    <Tooltip text="Messages" position="right">
      <div
        className={`cursor-pointer w-10 h-10 flex items-center justify-center ${
          activeTab === 'messages' && 'bg-[#111b21] rounded-lg'
        }`}
        onClick={() => setActiveTab('messages')}
      >
        <MessageSquare size={28} />
      </div>
    </Tooltip>

    <Tooltip text="Gallery" position="right">
      <div
        className={`cursor-pointer w-10 h-10 flex items-center justify-center ${
          activeTab === 'gallery' && 'bg-[#111b21] rounded-lg'
        }`}
        onClick={() => setActiveTab('gallery')}
      >
        <Images size={28} />
      </div>
    </Tooltip>

    <Tooltip text="Blogs" position="right">
      <div
        className={`cursor-pointer w-10 h-10 flex items-center justify-center ${
          activeTab === 'blogs' && 'bg-[#111b21] rounded-lg'
        }`}
        onClick={() => setActiveTab('blogs')}
      >
        <BookOpen size={28} />
      </div>
    </Tooltip>
  </div>

  <div className="flex flex-col items-center gap-10">
    <Tooltip text="Settings" position="right">
      <div
        className={`cursor-pointer w-10 h-10 flex items-center justify-center ${
          activeTab === 'settings' && 'bg-[#111b21] rounded-lg'
        }`}
        onClick={() => setActiveTab('settings')}
      >
        <Settings size={28} />
      </div>
    </Tooltip>

    {authUser?.profilePicture && (
         <div
        className={`cursor-pointer w-10 h-10 flex items-center justify-center ${
          activeTab === 'profile' && 'bg-[#111b21] rounded-lg'
        }`}>
        <Avatar
          src={authUser?.profilePicture}
          alt="User avatar"
          size={40}
          onClick={() => setActiveTab('profile')}
        />
        </div>
    )}
  </div>
</div>

  )
}

export default Menubar