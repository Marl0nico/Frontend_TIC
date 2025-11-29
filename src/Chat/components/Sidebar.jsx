import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Cog, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Extract friends from users array
  const allFriends = users.flatMap(user => 
    user.amigos.map(friend => ({
      _id: friend._id,
      nombre: friend.nombre,
      usuario: friend.usuario,
      fotoPerfil: friend.fotoPerfil
    }))
  );

  const filteredFriends = showOnlineOnly
    ? allFriends.filter((friend) => onlineUsers.includes(friend._id))
    : allFriends;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contactos</span>
          <Cog className="size-6 ml-auto cursor-pointer hover:animate-spin"
        onClick={() => {
          setIsSpinning(true);
          setTimeout(() => setIsSpinning(false), 3000);
          navigate('/dashboard/configuracion');
        }}/>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Mostrar solo online</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {filteredFriends.map((friend) => (
          <button
            key={friend._id}
            onClick={() => setSelectedUser(friend)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === friend._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={friend.fotoPerfil?.url || "/images/defaultprofile.jpg"}
                alt={friend.nombre}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(friend._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{friend.nombre}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredFriends.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No hay usuarios en linea</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;