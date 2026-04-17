import { useState, useEffect } from "react";
import { Button, Field, Input, Label } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../error/ErrorPopup";
import houseflyLogo from "../assets/housefly.png";
import { login, getCurrentUser } from "./auth.js"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login";

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) {
      setError("Please enter an email address!");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid!");
      return;
    } else if (!password) {
      setError("Please enter a password!");
      return;
    }

    try {
      login(email, password);
      window.location.href = "/"; // Force reload to get store data
      console.log("Welcome" + getCurrentUser().name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <>
      <ErrorPopup message={error} onClose={() => setError("")} />
      <div className="auth-container">
        <div className="min-h-screen flex items-center justify-center">
          <form
            className="space-y-8 w-full max-w-xl rounded-[2rem] bg-blue-500 px-14 py-12 shadow-2xl"
            onSubmit={async (e) => {
              e.preventDefault();
              await handleLogin();
            }}
          >
            <img src={houseflyLogo} alt="Housefly" className="mx-auto h-16 w-auto" />
            <h1 className="flex justify-center text-5xl font-bold tracking-tight text-slate-800">
              Login
            </h1>
            <Field>
              <Label className="mb-2 block text-lg text-slate-800">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                placeholder="email@email.com"
                className="w-full rounded-xl bg-zinc-200 px-5 py-4 text-lg text-slate-800 placeholder:text-zinc-500 outline-none ring-0 focus:bg-zinc-300"
              />
            </Field>
            <Field>
              <Label className="mb-2 block text-lg text-slate-800">Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                placeholder="•••••••••••"
                className="w-full rounded-xl bg-zinc-200 px-5 py-4 text-lg text-slate-800 placeholder:text-zinc-500 outline-none ring-0 focus:bg-zinc-300"
              />
            </Field>
            <p onClick={() => navigate("/register")} className="text-center text-base text-zinc-700 underline underline-offset-2 hover:text-slate-600">
              Don’t have an account? Sign up instead
            </p>
            <div className="flex justify-center">
              <Button 
                type="submit"
                className="rounded-2xl bg-slate-800 px-10 py-4 text-2xl text-white data-hover:bg-slate-700"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;