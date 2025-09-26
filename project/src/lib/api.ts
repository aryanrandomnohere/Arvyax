const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async register(
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Session endpoints
  async getMySessions(): Promise<ApiResponse<WellnessSession[]>> {
    return this.request("/my-sessions");
  }

  async createSession(
    session: Partial<WellnessSession>
  ): Promise<ApiResponse<WellnessSession>> {
    return this.request("/my-sessions", {
      method: "POST",
      body: JSON.stringify(session),
    });
  }

  async updateSession(
    id: string,
    session: Partial<WellnessSession>
  ): Promise<ApiResponse<WellnessSession>> {
    return this.request(`/my-sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(session),
    });
  }

  async deleteSession(id: string): Promise<ApiResponse> {
    return this.request(`/my-sessions/${id}`, {
      method: "DELETE",
    });
  }

  async getPublishedSessions(): Promise<ApiResponse<WellnessSession[]>> {
    return this.request("/sessions");
  }
}

export interface WellnessSession {
  id: string;
  title: string;
  tags: string[];
  json_url: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export const api = new ApiClient(API_BASE_URL);
