import { useState, useEffect } from "react";
import { Button, Field, Input, Label } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../error/ErrorPopup";
import BackgroundAuth from "../background/BackgroundAuth";
import { login, getCurrentUser } from "./auth.js"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
    // Lock scroll when component mounts
    document.body.classList.add('no-scroll');

    // Unlock scroll when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleLogin = () => {
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
      setIsSubmitting(true);
      setError("");

      login(email, password);

      window.location.href = "/"; // Force reload to get store data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 mt-16 flex items-center justify-center">
          <ErrorPopup message={error} onClose={() => setError("")} />
          <BackgroundAuth />
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 relative z-10 scale-125 -translate-y-8">
            <div className="w-full max-w-md my-auto">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleLogin();
                }}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Login
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Sign in to continue to your dashboard, saved listings, and
                    housing event insights.
                  </p>
                </div>

                <div className="space-y-5">
                  <Field>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>

                  <Field>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </Label>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      type="password"
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Sign up instead
                  </button>
                </p>
              </form>
            </div>
          </div>
      </div>
    </>
  );
};

export default Login;
