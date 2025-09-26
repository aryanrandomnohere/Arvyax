import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Layout } from "../components/Layout";
import { WellnessSession, api } from "../lib/api";
import { useAutoSave } from "../hooks/useAutoSave";
import {
  Save,
  Globe,
  ArrowLeft,
  Loader,
  Tag,
  Link as LinkIcon,
  Type,
  Cloud,
} from "lucide-react";
import toast from "react-hot-toast";

interface SessionFormData {
  title: string;
  tags: string;
  json_url: string;
}

export function SessionEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [session, setSession] = useState<WellnessSession | null>(null);
  const [publishing, setPublishing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    defaultValues: {
      title: "",
      tags: "",
      json_url: "",
    },
  });

  const formData = watch();
  const parsedTags = formData.tags
    ? formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // Auto-save hook
  useAutoSave({
    sessionId: session?.id || null,
    data: {
      title: formData.title,
      tags: parsedTags,
      json_url: formData.json_url,
    },
    onSaveSuccess: (updatedSession) => {
      setSession(updatedSession);
    },
  });

  useEffect(() => {
    if (id) {
      loadSession();
    } else {
      createNewSession();
    }
  }, [id]);

  const loadSession = async () => {
    try {
      setInitialLoading(true);
      const response = await api.getMySessions();
      const foundSession = response.data?.find((s) => s.id === id);

      if (foundSession) {
        setSession(foundSession);
        setValue("title", foundSession.title);
        setValue("tags", foundSession.tags.join(", "));
        setValue("json_url", foundSession.json_url);
      } else {
        toast.error("Session not found");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error("Failed to load session");
      navigate("/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setInitialLoading(true);
      const response = await api.createSession({
        title: "",
        tags: [],
        json_url: "",
        status: "draft",
      });

      if (response.data) {
        setSession(response.data);
        // Update URL to include the new session ID
        window.history.replaceState(null, "", `/editor/${response.data.id}`);
      }
    } catch (error: any) {
      toast.error("Failed to create session");
      navigate("/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await api.updateSession(session.id, {
        title: formData.title,
        tags: parsedTags,
        json_url: formData.json_url,
        status: "draft",
      });

      if (response.data) {
        setSession(response.data);
        toast.success("Session saved successfully");
      }
    } catch (error: any) {
      toast.error("Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!session) return;
    console.log("Publishing");

    try {
      setPublishing(true);
      const response = await api.updateSession(session.id, {
        title: formData.title,
        tags: parsedTags,
        json_url: formData.json_url,
        status: "published",
      });

      if (response.data) {
        setSession(response.data);
        toast.success("Session published successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error: any) {
      toast.error("Failed to publish session");
    } finally {
      setPublishing(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto text-green-600 mb-4" />
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? "Edit Session" : "Create Session"}
              </h1>
              <p className="text-gray-600 mt-1">
                {session?.status === "published"
                  ? "This session is published and live"
                  : "Auto-saves as you type"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {session?.status && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  session.status === "published"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
              >
                <Cloud className="w-4 h-4 mr-1" />
                {session.status === "published" ? "Published" : "Draft"}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-8">
            <form className="space-y-8">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  <div className="flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Session Title
                  </div>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="Enter your wellness session title..."
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Tags
                  </div>
                </label>
                <input
                  {...register("tags")}
                  type="text"
                  placeholder="meditation, yoga, mindfulness, stress-relief (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Separate tags with commas. These help users discover your
                  content.
                </p>
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {parsedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* JSON URL */}
              <div>
                <label
                  htmlFor="json_url"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Session Data URL
                  </div>
                </label>
                <input
                  {...register("json_url")}
                  type="url"
                  placeholder="https://example.com/session-data.json"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <p className="mt-2 text-sm text-gray-500">
                  URL to the JSON file containing your session's meditation or
                  yoga flow data.
                </p>
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {session?.updated_at && (
                  <span>
                    Last saved: {new Date(session.updated_at).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing || !formData.title.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-purple-600 text-white rounded-lg hover:from-green-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 flex items-center"
                >
                  {publishing ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  {session?.status === "published"
                    ? "Update Published"
                    : "Publish Session"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-green-50 to-purple-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Creating Effective Wellness Sessions
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Title Best Practices:</h4>
              <ul className="space-y-1">
                <li>• Use clear, descriptive titles</li>
                <li>• Include the session type (yoga, meditation, etc.)</li>
                <li>• Mention duration if applicable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Effective Tags:</h4>
              <ul className="space-y-1">
                <li>• Use specific, relevant keywords</li>
                <li>• Include difficulty level if applicable</li>
                <li>• Add mood or purpose tags</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
