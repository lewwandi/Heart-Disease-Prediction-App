import { useState } from "react";
import { useLogin } from "../hooks/useLogin";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    };

    return (
        <form className="login" onSubmit={handleSubmit}>

            <div className="text-center">
                <h3 className="text-lg font-semibold">Sign in</h3>
            </div>

            <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
            >
                Email:
            </label>
            <input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password:
                </label>
                <input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    autoComplete="current password"
                    placeholder="Enter password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}

            >
                {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    "Login"
                )}
            </button>
            {error && (
                <div className="mt-2 text-red-600 text-sm text-center">{error}</div>
            )}
        </form>

    );
};

export default Login;