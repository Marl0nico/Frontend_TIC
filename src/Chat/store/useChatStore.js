import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  messageListener: null, // Store reference to listener for proper cleanup

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axiosInstance.get("/mensaje/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axiosInstance.get(`/mensaje/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const token = useAuthStore.getState().token;
      const res = await axiosInstance.post(
        `/mensaje/enviar/${selectedUser._id}`,
        messageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.log("[Chat] No selectedUser, skipping subscription");
      return;
    }

    const socket = useAuthStore.getState().socket;

    // Ensure socket is connected before subscribing
    if (!socket || !socket.connected) {
      console.warn("[Chat] Socket not connected, waiting for connection");
      return;
    }

    // Cleanup previous listener if it exists
    if (get().messageListener) {
      console.log("[Chat] Removing previous listener");
      socket.off("newMessage", get().messageListener);
    }

    // Create and store listener reference
    const listener = (newMessage) => {
      console.log("[Chat] Received newMessage event:", newMessage);
      console.log("[Chat] Selected user ID:", selectedUser._id);
      console.log("[Chat] Message sender ID:", newMessage.emisor);

      // Convert both IDs to strings for safe comparison
      const messageEmissorIdString = String(newMessage.emisor);
      const selectedUserIdString = String(selectedUser._id);
      const isMessageSentFromSelectedUser = messageEmissorIdString === selectedUserIdString;

      console.log(
        "[Chat] IDs match?",
        isMessageSentFromSelectedUser,
        `(${messageEmissorIdString} === ${selectedUserIdString})`
      );

      if (!isMessageSentFromSelectedUser) {
        console.log("[Chat] Message is not from selected user, ignoring");
        return;
      }

      console.log("[Chat] Adding message to state");
      set({
        messages: [...get().messages, newMessage],
      });
    };

    set({ messageListener: listener });
    socket.on("newMessage", listener);
    console.log("[Chat] Subscribed to newMessage events");
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { messageListener } = get();

    if (messageListener && socket) {
      console.log("[Chat] Unsubscribing from newMessage events");
      socket.off("newMessage", messageListener);
      set({ messageListener: null });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
