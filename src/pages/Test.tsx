import  { useRef, useEffect } from 'react';

const Test = () => {
  const ws = useRef<WebSocket | null>(null); 

  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current?.send(JSON.stringify({ type: 'ping' }));
    };

    ws.current.onmessage = (message) => {
      console.log('Server says:', message.data);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return <div>Test</div>;
};

export default Test;
