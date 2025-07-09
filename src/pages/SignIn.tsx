import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-no-background.png";
import { AuthService } from "../services/AuthService";
import { toast } from "../components/Toast";
import { TokenService } from "../services/TokenServices";
import { useAuthContext } from "../context/AuthContext";

type SignInFormData = {
  email: string;
  password: string;
};

type Errors = Partial<Record<keyof SignInFormData, string>>;

const SignIn = () => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate()
  const {setAuthUser } = useAuthContext();
  const validateField = (name: keyof SignInFormData, value: string): string => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        break;
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    const errorMessage = validateField(id as keyof SignInFormData, value);
    setErrors((prev) => ({
      ...prev,
      [id as keyof SignInFormData]: errorMessage,
    }));
    // setAuthError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const newErrors: Errors = {};
    (Object.keys(formData) as (keyof SignInFormData)[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await AuthService.SignIn(formData);
      const {accessToken,user} = response.data
     // Save accessToken to localStorage
     TokenService.setAccessToken(accessToken)
     localStorage.setItem("user", JSON.stringify(user));
     setAuthUser(user)
      toast.success('Login Successfull!');
      navigate('/')
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      setAuthError(error.message);
    }
  };
  const [count,setCount] = useState(0)
  const handleShowToast = ()=>{
    toast.success(`Logged in successfully! ${count}`);
    setCount(count + 1)
  }
  const handleShowToast2 = ()=>{
    toast.error(`Logged in successfully! ${count}`);
    setCount(count + 1)
  }
  const handleAction = async () => {
    const id = toast.loading("Processing...");
  
    try {
      await new Promise((res) => setTimeout(res, 10000));
      toast.update(id, "success", "Action completed!");
    } catch (err) {
      toast.update(id, "error", "Something went wrong");
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 bg-emerald-600 flex flex-col items-center justify-center">
        <div className="w-7/12 flex flex-col items-start justify-start text-left">
          <img src={logo} alt="logo" className="w-20" />
          <h1 className="text-3xl font-medium text-white">Join ChatConnect</h1>
          <p className="text-gray-100">
            Connect with friends and family instantly. Join millions of users
            who trust our secure messaging platform.
          </p>
        </div>
      </div>

      <div className="w-1/2 h-full flex items-start justify-center p-8">
        <div className="flex w-8/12 max-w-xl flex-col mt-8 gap-4 items-start justify-center">
          <div className="flex w-8/12 flex-col justify-start items-start">
            <h3 className="text-3xl text-left font-medium">Sign in</h3>
            <span className="text-gray-600">
              Log in to continue your secure messaging experience.
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col max-w-lg gap-4 mt-4 w-full"
          >
            <div className="flex w-full flex-col gap-1">
              <label htmlFor="email" className="font-medium text-sm">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 focus:outline-none rounded-lg px-2 py-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 focus:outline-none rounded-lg px-2 py-2"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {authError}
              </div>
            )}

            <button className="bg-emerald-600 p-2 cursor-pointer rounded-md text-white">
              Sign in
            </button>
          </form>

          <span className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-600">
              Sign up
            </Link>
          </span>
          <button onClick={handleShowToast}>Show Toast1</button>
          <button onClick={handleShowToast2}>Show Toast2</button>
          <button onClick={handleAction}>Show Toast3</button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
