import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  LogOut,
  Plus,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
    },
    {
      path: "/sessions",
      label: "Browse Sessions",
      icon: BookOpen,
      active: location.pathname === "/sessions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {/* <Sparkles className="w-5 h-5 text-white" /> */}
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Arvyax
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                        item.active
                          ? "border-green-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Create Session Button */}
              <button
                onClick={() => navigate("/editor")}
                className="bg-gradient-to-r from-green-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-purple-700 transition-all duration-200 flex items-center text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Session</span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </div>
                  <div className="text-xs text-gray-500">Wellness Creator</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    item.active
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
