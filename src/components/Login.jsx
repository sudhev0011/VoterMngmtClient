import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserCredentials } from "../store/slices/authSlice";
import { Vote, AlertCircle, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthComponent = ({ setRole }) => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });
  const [registerCredentials, setRegisterCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginChange = (e) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value,
    });
    setLoginError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterCredentials({
      ...registerCredentials,
      [e.target.name]: e.target.value,
    });
    setRegisterError("");
    setRegisterSuccess("");
  };

  const validateRegisterForm = () => {
    if (!registerCredentials.username.trim()) {
      setRegisterError("Username is required");
      return false;
    }
    if (!registerCredentials.password.trim()) {
      setRegisterError("Password is required");
      return false;
    }
    if (registerCredentials.password.length < 6) {
      setRegisterError("Password must be at least 6 characters long");
      return false;
    }
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
      setRegisterError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}auth/login`,
        loginCredentials,
        {
          withCredentials: true,
        }
      );
      dispatch(
        setUserCredentials({
          role: res.data.role,
          userId: res.data.userId,
          isAuthenticated: res.data.isAuthenticated,
        })
      );
      setRole(res.data.role);
      navigate(res.data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setLoginError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}auth/register`,
        registerCredentials
      );
      setRegisterSuccess(
        "Registration successful! Please login with your credentials."
      );
      setRegisterCredentials({
        username: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (err) {
      setRegisterError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const onGoogleSuccess = async(authCredential)=>{
    try {
      setLoginLoading(true);
      setRegisterLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}auth/google`,{token:authCredential.credential},{withCredentials: true});
      dispatch(setUserCredentials({role: res.data.role, userId: res.data.userId, isAuthenticated: res.data.isAuthenticated}));
      navigate('/');
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }finally{
      setRegisterLoading(false);
      setLoginLoading(false);
    }
  }

  const onGoogleFailure = (message)=>{
    setLoginError(message);
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Vote className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Voter Management
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Secure access to your voting platform
              </p>
            </CardHeader>

            <CardContent>
              <div className="text-center">
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={onGoogleFailure}
                  render={(renderProps) => (
                    <Button
                      className="w-full mb-4 bg-transparent hover:bg-transparent text-black outline outline-1 outline-gray-200"
                      onClick={renderProps.onClick}
                      disabled={
                        renderProps.disabled || loginLoading || registerLoading
                      }
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="mr-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <p className="text-sm font-medium">
                        Continue with Google
                      </p>
                    </Button>
                  )}
                />
              </div>
            </CardContent>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="login"
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        name="username"
                        value={loginCredentials.username}
                        onChange={handleLoginChange}
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          name="password"
                          value={loginCredentials.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginLoading}
                    >
                      {loginLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  {registerError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}

                  {registerSuccess && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-700">
                        {registerSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        name="username"
                        value={registerCredentials.username}
                        onChange={handleRegisterChange}
                        placeholder="Choose a username"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          name="password"
                          value={registerCredentials.password}
                          onChange={handleRegisterChange}
                          placeholder="Create a password (min. 6 characters)"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowRegisterPassword(!showRegisterPassword)
                          }
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={registerCredentials.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="Confirm your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerLoading}
                    >
                      {registerLoading
                        ? "Creating Account..."
                        : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthComponent;
