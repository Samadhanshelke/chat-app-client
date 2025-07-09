// socket.js
import { io } from 'socket.io-client';
import { TokenService } from './TokenServices';

export const connectSocket = () => {
  const token = TokenService.getAccessToken(); // Your method to get the token

  return io('http://localhost:5000', {
    auth: { token },
    withCredentials: true,
  });
};
