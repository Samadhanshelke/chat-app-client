// socket.js
import { io } from 'socket.io-client';
import { TokenService } from './TokenServices';

export const connectSocket = () => {
  const token = TokenService.getAccessToken(); // Your method to get the token

  return io(import.meta.env.VITE_API_SOCKET_URL, {
    auth: { token },
    withCredentials: true,
  });
};
