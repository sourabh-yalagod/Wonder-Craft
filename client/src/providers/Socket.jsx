import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(import.meta.env.VITE_API_URL));
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { useSocket, SocketProvider };
