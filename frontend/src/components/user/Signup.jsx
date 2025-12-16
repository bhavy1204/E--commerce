import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../../utils/api";
import { GoogleLogin } from "@react-oauth/google";

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Otp 
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token received");

      const backendResponse = await apiClient.googleLogin(idToken);

      console.log("Backend response:", backendResponse);

      if (backendResponse.success) {
        localStorage.setItem("token", backendResponse.data.accessToken);

        // Redirect to appropriate page based on user role
        const userRole = backendResponse.data.user?.role;
        navigate(userRole === "admin" ? "/admin" : "/home");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed.");
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter email first");
      return;
    }

    setError("");
    setOtpLoading(true);

    try {
      await apiClient.sendEmailOtp(formData.email);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }

    setError("");
    setOtpLoading(true);

    try {
      await apiClient.verifyEmailOtp(formData.email, otp);
      setOtpVerified(true);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setError("Please verify your email first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiClient.register(formData);
      if (response.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="form-div flex flex-col items-center gap-5 w-full max-w-md rounded-md px-6 py-8 shadow-lg bg-white">
        <h1 className="text-3xl font-semibold text-purple-800">Signup</h1>

        {/* Error */}
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed.")}
            width="100%"
          />
        </div>

        <hr className="w-full my-4 border-gray-300" />

        {/* Normal Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-1/2 px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-1/2 px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email + Send OTP */}
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={otpVerified}
              className="flex-1 px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent || otpLoading}
              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {otpSent ? "Sent" : "Send OTP"}
            </button>
          </div>

          {/* OTP Verify */}
          {otpSent && !otpVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          )}

          {/* OTP Verified Message */}
          {otpVerified && (
            <p className="text-green-600 text-sm font-medium">
              Email verified ✓
            </p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex items-center justify-between w-full">
            <Link to="/login" className="text-sm text-blue-600 underline">
              Already have an account? Login
            </Link>

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="bg-green-600 mt-5 px-4 py-2 font-semibold text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};