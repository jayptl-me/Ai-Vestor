// src/pages/Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const BASE_URL = "https://odoo-charusat-ai-vestor-2025-wgl2.onrender.com/api"; // Adjust based on your backend URL

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const payload = isLogin
                ? { username, password }
                : { username, password, email };

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.messages);
            }

            if (isLogin) {
                // Store token and redirect on successful login
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("userId", data.data.userId);
                navigate("/dashboard");
            } else {
                // Switch to login mode after successful registration
                setIsLogin(true);
                setError("Registration successful! Please login.");
                setUsername("");
                setPassword("");
                setEmail("");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-12">
                <div className="container mx-auto px-4 max-w-md">
                    <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl p-8 shadow-lg border border-border">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                <span className="text-primary">AI</span> Investor
                            </h1>
                            <p className="text-foreground/70">
                                {isLogin ? "Welcome back!" : "Create your account"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground/80">
                                    <User className="h-4 w-4" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground/80">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Enter your email"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground/80">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-foreground/70 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError("");
                                        setUsername("");
                                        setPassword("");
                                        setEmail("");
                                    }}
                                    className="ml-1 text-primary hover:underline font-medium"
                                >
                                    {isLogin ? "Sign Up" : "Login"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-background py-6 border-t border-border">
                <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
                    <p>© {new Date().getFullYear()} AI Investor. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Auth;