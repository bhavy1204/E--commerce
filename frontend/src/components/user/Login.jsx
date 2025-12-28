import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { apiClient } from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      navigate(response.data?.user?.role === "admin" ? "/admin" : "/home");
    } catch (err) {
      console.log(err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token received");

      const res = await apiClient.googleLogin(idToken);

      const data = res;
      console.log("Backend response:", data);

      // Handle successful login
      if (data.success) {
        const userData = data.data?.user;
        const token = data.data?.accessToken;

        // Store token properly
        if (token) {
          localStorage.setItem("token", token);
        }

        // Update global state
        setUser(userData);

        // Redirect
        navigate(userData.role === "admin" ? "/admin" : "/home");
      } else {
        throw new Error(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="form-div flex flex-col items-center gap-5 w-full max-w-md rounded-md px-6 py-8 shadow-lg bg-white">
        <h1 className="text-3xl font-semibold text-purple-800">Login</h1>
        <p className="text-sm text-purple-400">Welcome back</p>

        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full"
          autoComplete="off"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex justify-end w-full">
            <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
              Forgot Password?
            </Link>
          </div>
          <div className="flex items-center justify-between w-full">
            <Link to="/signup" className="text-sm text-blue-600 underline">
              Don't have an account? Sign up
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 mt-5 px-4 py-2 font-semibold text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Submit"}
            </button>
          </div>
        </form>

        {/* GOOGLE LOGIN - Using consistent approach */}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Google login failed.")}
        />
      </div>
    </div>
  );
}
