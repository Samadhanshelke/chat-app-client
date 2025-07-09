// pages/AllUsers.js
import { useEffect, useState } from 'react';
import { UserServices } from '../services/UserServices';
import { connectSocket } from '../services/Socket';


const Messages = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      const response = await UserServices.getAllUsers();
      console.log(response); // log the response from the backend
      setUsers(response.users);
    };

    fetchUsers();

    // Set up the socket connection
    const socket = connectSocket();

    socket.on('online-users', (online) => {
      setOnlineUsers(online); // update the online users list
      console.log(online)
    });

    // Cleanup: disconnect the socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">All Users</h1>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user._id} className="flex items-center space-x-2">
            <span>{user.userName || 'unknown'}</span>
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
