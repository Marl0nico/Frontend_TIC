import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "../Chat/store/useAuthStore";

const Login = () => {
  useAuthStore();
  const navigate = useNavigate();

  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validDomains = ["@puce.edu.ec", "@epn.edu.ec", "@est.ups.edu.ec"];
    const isStudent = validDomains.some(domain => form.email.endsWith(domain));
    try {
      if (isStudent) {
        await useAuthStore.getState().login(form, false);
      } else {
        await useAuthStore.getState().login(form, true);
      }

      await useAuthStore.getState().checkAuth();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast(error.response?.data?.msg || "Error de autenticación");
      setform({});
    }
  };

  return (
    <>
      <div
        className="w-1/2 h-screen bg-[url('/images/login.webp')] 
            bg-no-repeat bg-cover bg-center sm:block
            "
      ></div>

      <div className="w-1/2 h-screen bg-white flex justify-center items-center">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500">
            Welcome back
          </h1>
          <small className="text-gray-400 block my-4 text-sm">
            Welcome back! Please enter your details
          </small>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                type="email"
                placeholder="Enter you email"
                className="block w-full rounded-md border  focus:outline-none focus:ring-1 py-1 px-2 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="********************"
                  className="block w-full rounded-md border focus:outline-none focus:ring-1 py-1 px-2 pr-10 text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="my-4">
              <button
                to="/dashboard"
                className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-5 text-xs border-b-2 py-4 ">
            <Link
              to="/forgot/id"
              className="underline text-sm text-gray-400 hover:text-gray-900"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>No tienes cuenta?</p>
            <Link
              to="/register"
              className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
