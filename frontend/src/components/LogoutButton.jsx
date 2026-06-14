import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("campusflow_token");
    localStorage.removeItem("campusflow_user");

    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center gap-2
        px-3 py-1
        rounded-full
        bg-red-500
        text-white
        font-medium
        shadow-md
        transition-all duration-200
        hover:bg-red-600
        hover:shadow-lg
        hover:cursor-pointer
      "
    >
      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
      Logout
    </button>
  );
}
