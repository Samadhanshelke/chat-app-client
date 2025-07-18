// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserServices } from '../services/UserServices';
import { connectSocket } from '../services/Socket';

interface User {
  _id: string;
  userName?: string;
  profilePicture:string;
  email:string;
  about:string;
  name:string
}

interface MessageContextType {
  users: User[];
  onlineUsers: string[];
  error: string | null;
}

const MessageContext = createContext<MessageContextType>({
  users: [],
  onlineUsers: [],
  error: null,
});

export const useMessage = () => useContext(MessageContext);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all users once when app mounts
    const fetchUsers = async () => {
      try {
        const response = await UserServices.getAllUsers();
        setUsers(response.users || []);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();

    // Connect to socket once
    const socket = connectSocket();

    socket.on('online-users', (online: string[]) => {
      setOnlineUsers(online);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MessageContext.Provider value={{ users, onlineUsers, error }}>
      {children}
    </MessageContext.Provider>
  );
};
