import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setLoggedin, addUser } from "../store/features/common/userSlice";
import { axiosConfig } from "../axios/axiosConfig";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const loader = (
    <div className="w-[1.5rem] h-[1.5rem] mx-auto rounded-full border-2 border-transparent border-r-white border-t-white animate-spin"></div>
  );
  const [data, setData] = useState({
    user_name: "",
    password: "",
  });
  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }
  function checkFields() {
    return Object.values(data).every((item) => item.length > 0);
  }
  async function login() {
    if (checkFields()) {
      try {
        setLoading(true);
        const promise = axiosConfig.post("/auth/login", data);
        const res = await promise;

        toast.promise(promise, {
          loading: "Logging in",
          success: "Logged in Successfully",
          error: false,
        });
        if (res.status == 200) {
          dispatch(setLoggedin(true));
          const userRes = await axiosConfig.get("/auth/users/me");

          dispatch(addUser(userRes.data));
          const userRole = userRes.data.role;
          navigate(`/${userRole}/dashboard`);
        }
      } catch (error) {
        toast.error(error.response.data.detail);
      } finally {
        setLoading(false);
      }
    } else {
      toast("Email and password required!", {
        icon: "⚠️",
      });
    }
  }
  useEffect(() => {
    if (state) {
      setData({
        user_name: state.user_name,
        password: state.password,
      });
    }
  }, []);

  return (
    <div className="p-3 h-screen flex justify-center items-center">
      <div className="w-[30rem] h-auto bg-white rounded-lg p-6 space-y-14 shadow-lg">
        <h1 className="text-2xl font-semibold text-center">Welcome Back!</h1>
        <div className="flex flex-col gap-y-4 ">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="user_name" className="text-slate-500">
              Email
            </label>
            <input
              value={data.user_name}
              onChange={handleInputChange}
              type="email"
              name="user_name"
              placeholder="e.g. johndoe@gmail.com"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className="text-slate-500">
              Password
            </label>
            <input
              value={data.password}
              onChange={handleInputChange}
              type="password"
              name="password"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          {/* <span className="text-sm text-blue-500 cursor-pointer">
            Forget Password?
          </span> */}
        </div>
        <button
          className="bg-blue-500 text-white w-full py-2 rounded-full"
          onClick={login}
        >
          {loading ? loader : "Continue"}
        </button>
        <div className="flex flex-col gap-y-5">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link className="text-blue-500" to="/signup">
              {" "}
              Sign up now{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
