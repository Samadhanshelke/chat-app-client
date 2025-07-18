import { useMessage } from "../context/MessageContext";

interface Props {
  onSelectUser: (userId: string, userName?: string,profile?:string) => void;
}

const Messages: React.FC<Props> = ({ onSelectUser }) => {
const {users,onlineUsers} = useMessage()
console.log(users)
  return (
 <div className=" p-4">
      <h2 className="text-xl font-bold mb-4 w-full whitespace-nowrap">Chat Connect</h2>
      <ul className="space-y-2 w-full">
        {users.map(user => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user._id, user.name,user.profilePicture)}
            className="cursor-pointer hover:bg-gray-800 w-full p-2 rounded-lg flex items-center gap-2"
          >
            <img src={user.profilePicture} alt="" className="rounded-full h-8 w-8"/>
            {user.name || 'Unknown'}{' '}
            {onlineUsers.includes(user._id) && (
              <span className="text-green-500 text-sm">(Online)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
