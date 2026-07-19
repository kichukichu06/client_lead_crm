import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Top navigation bar shown on every authenticated page.
 * Contains the mobile menu toggle, admin name, and logout button.
 */
const Navbar = ({ onMenuClick, title }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-slate-500 hover:text-slate-700"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="font-medium">{admin?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary !px-3 !py-2"
          title="Logout"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
