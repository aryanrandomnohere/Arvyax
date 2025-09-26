import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WellnessSession } from "../lib/api";
import { formatDistanceToNow } from "date-fns";
import {
  CreditCard as Edit,
  Trash2,
  Tag,
  Clock,
  Globe,
  FileText,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

interface SessionCardProps {
  session: WellnessSession;
  onEdit: (session: WellnessSession) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

export function SessionCard({
  session,
  onEdit,
  onDelete,
  showActions = true,
}: SessionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(session);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(session.id);
  };

  const getStatusColor = (status: "draft" | "published") => {
    return status === "published"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (status: "draft" | "published") => {
    return status === "published" ? Globe : FileText;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden group">
      {/* Header Image */}
      <div className="h-32 bg-gradient-to-br from-green-400 via-purple-500 to-orange-400 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              session.status
            )}`}
          >
            {(() => {
              const Icon = getStatusIcon(session.status);
              return <Icon className="w-3 h-3 mr-1" />;
            })()}
            {session.status === "published" ? "Published" : "Draft"}
          </div>
        </div>
        {showActions && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
              >
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Session
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Session
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {session.title || "Untitled Session"}
        </h3>

        {/* Tags */}
        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {session.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {session.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                +{session.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* JSON URL */}
        {session.json_url && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="truncate">{session.json_url}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              Updated {formatDistanceToNow(new Date(session.updatedAt))} ago
            </span>
          </div>
          {showActions && (
            <button
              onClick={handleEdit}
              className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
