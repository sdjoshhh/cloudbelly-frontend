import { useState, useEffect } from "react";
import { Button, Field, Input, Label } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../error/ErrorPopup";
import BackgroundAuth from "../background/BackgroundAuth";
import { register } from "./auth.js"

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - Housefly";
    // Lock scroll when component mounts
    document.body.classList.add('no-scroll');

    // Unlock scroll when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleRegister = () => {
    if (!name) {
      setError("Please enter a username!");
      return;
    } else if (!email) {
      setError("Please enter an email address!");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid!");
      return;
    } else if (!password) {
      setError("Please enter a password!");
      return;
    } else if (!confirmPassword) {
      setError("Please confirm your password!");
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      register(email, password, name);

      window.location.href = "/"; // Force reload to get store data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsDontMatch =
    confirmTouched &&
    password !== "" &&
    confirmPassword !== "" &&
    password !== confirmPassword;

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
                  await handleRegister();
                }}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Register
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Sign up to create an account and start using our services.
                  </p>
                </div>

                <div className="space-y-5">
                  <Field>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>

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

                  <Field>
                    <Label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm Password
                    </Label>
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setConfirmTouched(true)}
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <p className="text-sm text-red-600">
                      {passwordsDontMatch ? "Passwords do not match" : "\u00A0"}
                    </p>
                  </Field>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Log in instead
                  </button>
                </p>
              </form>
            </div>
          </div>
      </div>
    </>
  );
};

export default Register;
