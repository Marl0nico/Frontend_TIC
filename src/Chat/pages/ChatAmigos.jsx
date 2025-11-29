import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ChatAmigos = () => {
  const { selectedUser } = useChatStore();
  const { authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className="h-fit bg-base-200" data-theme={theme}>
      <div className="flex items-center justify-center pt-1 pb-1 px-0">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatAmigos;
