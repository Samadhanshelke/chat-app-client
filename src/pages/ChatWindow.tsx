import { useRef, useState } from "react";
// import { connectSocket } from "../services/Socket";
// import { MessageServices } from "../services/MessageService";
import { useAuthContext } from "../context/AuthContext";

interface ChatWindowProps {
  receiverId: string;
  receiverName?: string;
  recieverProfile?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiverId,
  receiverName,
  recieverProfile
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { fromSelf: boolean; content: string }[]
  >([]);
  // const [typingFromOtherUser, setTypingFromOtherUser] = useState(false);
  const socketRef = useRef<any>(null);
  // const typingTimeoutRef = useRef<any>(null);

  const { authUser } = useAuthContext();

  // const fetchHistory = async (receiverId: string) => {
  //   try {
  //     const res = await MessageServices.getUserMessagesById(receiverId);
  //     const currentUserId = authUser?.id;

  //     const mappedMessages = res.messages.map((msg: any) => ({
  //       content: msg.content,
  //       fromSelf: msg.from === currentUserId,
  //     }));

  //     setMessages(mappedMessages);
  //   } catch (err) {
  //     console.error("Failed to fetch chat history:", err);
  //   }
  // };

  // useEffect(() => {
  //   const socket = connectSocket();
  //   socketRef.current = socket;
  //   fetchHistory(receiverId);
  //   // Listen for messages
  //   socket.on("receive-message", ({ from, content }) => {
  //     if (from === receiverId) {
  //       setMessages((prev) => [...prev, { fromSelf: false, content }]);
  //     }
  //   });

  //   // Listen for typing
  //   socket.on("typing", ({ from }) => {
  //     console.log(from, receiverId);
  //     if (from === receiverId) {
  //       console.log("first");
  //       setTypingFromOtherUser(true);

  //       // Hide typing after 2 seconds
  //       clearTimeout(typingTimeoutRef.current);
  //       typingTimeoutRef.current = setTimeout(() => {
  //         setTypingFromOtherUser(false);
  //       }, 2000);
  //     }
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [receiverId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (socketRef.current && receiverId) {
      socketRef.current.emit("typing", {
        to: receiverId,
        from: authUser?.id,
      });
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    socketRef.current.emit("send-message", {
      to: receiverId,
      content: message,
    });

    setMessages((prev) => [...prev, { fromSelf: true, content: message }]);
    setMessage("");
  };

  return (
    <div className="w-full flex flex-col h-full text-white  relative ">
      <div className="p-4 border-b border-b-gray-700 font-semibold flex sticky top-0 left-0 items-center gap-2"> <img src={recieverProfile} alt="" className="rounded-full h-8 w-8"/>{receiverName}</div>

      <div className="flex-1 p-4  space-y-3 overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-xs  ${
              msg.fromSelf ? "bg-green-800 ml-auto " : " bg-[#202c33]"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div className="">
          {/* {typingFromOtherUser && <div className="text-sm">Typing...</div>} */}
        </div>
      </div>

      <div className="p-4 border-t border-t-gray-700 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          className="flex-1 border border-gray-700 rounded p-2 text-white"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
