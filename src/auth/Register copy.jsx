import {useState, useEffect} from 'react';
import {Button, Field, Input, Label} from '@headlessui/react';
import {useNavigate} from 'react-router-dom';
import ErrorPopup from '../error/ErrorPopup';
import { register, getCurrentUser } from "./auth"

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
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
      register(email, password, name);
      window.location.href = "/login"; // Force reload to get store data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  useEffect(() => {
    document.title = "Register";
  }, []);

  const passwordsDontMatch =
    confirmTouched &&
    password !== "" &&
    confirmPassword !== "" &&
    password !== confirmPassword;

  return (
    <>
      <ErrorPopup message={error} onClose={() => setError("")} />
      <div className="auth-container">
        <div className="min-h-screen flex items-center justify-center">
          <form
            className="space-y-4 w-full max-w-xl rounded-[2rem] bg-blue-500 px-14 py-12 shadow-2xl"
            onSubmit={async (e) => {
              e.preventDefault();
              await handleRegister();
            }}
          >
            <h1 className="flex justify-center text-5xl font-bold tracking-tight text-slate-800">
              Register
            </h1>
            <Field>
              <Label className="mb-2 block text-lg text-slate-800">Username</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                placeholder="John Doe"
                className="w-full rounded-xl bg-zinc-200 px-5 py-4 text-lg text-slate-800 placeholder:text-zinc-500 outline-none ring-0 focus:bg-zinc-300"
              />
            </Field>
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
                className={`w-full rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-zinc-500 outline-none
                  ${passwordsDontMatch
                    ? "bg-red-100 ring-2 ring-red-500 focus:bg-red-200"
                    : "bg-zinc-200 ring-0 focus:bg-zinc-300"  }`}
              />
            </Field>
            <Field>
              <Label className="mb-2 block text-lg text-slate-800">Confirm Password</Label>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                name="confirmPassword"
                type="password"
                placeholder="•••••••••••"
                className={`w-full rounded-xl px-5 py-4 text-lg text-slate-800 placeholder:text-zinc-500 outline-none
                  ${passwordsDontMatch
                    ? "bg-red-100 ring-2 ring-red-500 focus:bg-red-200"
                    : "bg-zinc-200 ring-0 focus:bg-zinc-300"  }`}
              />
            </Field>
            <p className="text-sm text-red-600">
              {passwordsDontMatch ? "Passwords do not match" : "\u00A0"}
            </p>
            <p onClick={() => navigate('/login')} className="text-center text-base text-zinc-700 underline underline-offset-2 hover:text-slate-600">
              Already have an account? Sign in instead
            </p>
            <div className="flex justify-center">
              <Button 
                type="submit"
                className="rounded-2xl bg-slate-800 px-10 py-4 text-2xl text-white data-hover:bg-slate-700"
              >
                Register
              </Button>
            </div>  
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;