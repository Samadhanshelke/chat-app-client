import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-no-background.png";
import { AuthService } from "../services/AuthService";
import { MdDone } from "react-icons/md";
import OTPInput from "../components/OTPInput";
import { TokenService } from "../services/TokenServices";
import { useAuthContext } from "../context/AuthContext";

type FormData = {
  name: string;
  email: string;
  userName: string;
  password: string;
  otp:string
};

type Errors = Partial<Record<keyof FormData, string>>;

function debounce<F extends (...args: any[]) => void>(func: F, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const SignUp = () => {
  const [showOtpScreen,setShowOtpScreen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name:"",
    email: "",
    userName: "",
    password: "",
    otp:""
  });
  const [otp, setOtp] = useState("");
 const {setAuthUser } = useAuthContext();
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [errors, setErrors] = useState<Errors>({});

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return `${name} is required`;
        if (!/^[a-zA-Z]{2,}$/.test(value))
          return `${name} must be at least 2 letters and contain only alphabets`;
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        break;
      case "userName":
        if (!value.trim()) return "Username is required";
        if (!/^[a-zA-Z0-9]{3,}$/.test(value))
          return "Username must be at least 3 characters and only letters or numbers";
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

  const validateUsername = async (username: string) => {
    if (!username.trim()) return;
    try {
      setIsCheckingUsername(true);
      const response = await AuthService.ValidateUserName(username);
      console.log(response);
      if (response.data.success) {
        setUsernameAvailable(true);
        setErrors((prev) => ({ ...prev, userName: "" }));
      } 
    } catch (err) {
      setUsernameAvailable(null);
      setErrors((prev) => ({
        ...prev,
        userName: "Username is already taken",
      }));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const debouncedValidateUsername = useRef(
    debounce((username: string) => validateUsername(username), 2000)
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  
    const errorMessage = validateField(id as keyof FormData, value);
  
    setErrors((prev) => ({
      ...prev,
      [id as keyof FormData]: errorMessage,
    }));
  
    if (id === "userName") {
      if (errorMessage || value.trim() === "") {
        setUsernameAvailable(null); // 👈 reset if invalid or empty
        return;
      }
  
      debouncedValidateUsername(value);
    }
  };
  

  const handleVerifyOtp = async(e: FormEvent) => {
    e.preventDefault();

    const newErrors: Errors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowOtpScreen(true)
    console.log("Submitting otp:", formData);
    const response = await AuthService.SendOtp(formData.email)
    console.log(response)
  };

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();


    const finalFormData = {
      ...formData,
      otp: otp,
    };
    console.log("Submitting form:", finalFormData);
try {
  const response = await AuthService.SignUp(finalFormData)
  const {accessToken,user} = response.data
      TokenService.setAccessToken(accessToken)
      localStorage.setItem("user", JSON.stringify(user));
      setAuthUser(user)
} catch (error) {
  console.error("Error during sign-up:", error);
  // Handle error (e.g., show a message to the user)
}
  };

  return (
    <>
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
{
  showOtpScreen ? (
    <div className="w-1/2 h-full flex items-start justify-center p-8">
    <div className="flex w-8/12 max-w-xl flex-col mt-8 gap-4 items-center justify-center">
  <h3 className="text-3xl font-medium">Verify Your OTP</h3>
  <span className="text-gray-600 mb-6 text-center w-9/12">
    We’ve sent a 6-digit verification code to your registered email. Please enter it below to continue.
  </span>

  <div className="flex flex-col items-center justify-center w-full ">
    <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
    <OTPInput length={6} onChange={handleOtpChange} />
    
    <button
      onClick={handleSubmit}
      className="mt-6 bg-emerald-600 text-white px-4 py-2 rounded-md"
    >
      Verify OTP
    </button>
  </div>
</div>
  </div>
  ):( 
     <div className="w-1/2 h-full flex items-start justify-center p-8">
    <div className="flex w-8/12 max-w-xl flex-col mt-8 gap-4 items-start justify-center">
      <div className="flex items-start w-8/12 flex-col justify-start">
        <h3 className="text-3xl font-medium">Sign up</h3>
        <span className="text-gray-600">
          Start your journey with chatConnect
        </span>
      </div>

      <form
        onSubmit={handleVerifyOtp}
        className="flex flex-col max-w-lg gap-6 mt-4 w-full"
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="firstName" className="font-medium text-sm">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 focus:outline-none rounded-lg px-2 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="userName" className="font-medium text-sm">
            Username
          </label>
          <div className="relative w-full">
            <input
              id="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              className="border border-gray-300 w-full focus:outline-none rounded-lg px-2 py-2"
            />
            {usernameAvailable === true && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xl">
                <MdDone />
              </span>
            )}
          </div>
          {isCheckingUsername && (
            <p className="text-blue-500 text-sm">
              Checking availability...
            </p>
          )}
          {errors.userName && (
            <p className="text-red-500 text-sm">{errors.userName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
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

        <button
          type="submit"
          className="bg-emerald-600 p-2 cursor-pointer rounded-md text-white"
        >
          Create Account
        </button>
      </form>

      <span className="text-gray-400 text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="text-emerald-600">
          Sign in
        </Link>
      </span>
    </div>
  </div>)
}
    
    </div>
    </>
  );
};

export default SignUp;
