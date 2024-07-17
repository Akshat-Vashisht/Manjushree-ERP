import React, { useEffect, useState } from "react";
import { RiAppleLine, RiGoogleLine } from "react-icons/ri";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosConfig } from "../axios/axiosConfig";
const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    user_name: "",
    password: "",
    cnfPassword:"",
    role: 1,
  });

  const loader = (
    <div className="w-[1.5rem] h-[1.5rem] mx-auto rounded-full border-2 border-transparent border-r-white border-t-white animate-spin"></div>
  );
  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  }
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return re.test(password);
  }

  function checkFields() {
    if (!Object.values(data).every((item) => typeof(item)==="string" ? item.trim().length > 0:true)) {
      return 0;
    } else if (!validateEmail(data.user_name)) {
      return 1;
    } else if (data.password !== data.cnfPassword) {
      return 2;
    } else if (!validatePassword(data.password)) {
      return 3;
    }
    return 4;
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }
  async function signup() {
    const check = checkFields();
    if (check === 4) {
      delete data.cnfPassword;
      try {
        setLoading(true);
        const res = await axiosConfig.post("/auth/register", data);
        console.log(res)
        toast.success("User created successfully");
        if (res.status === 200) {
          navigate("/", {
            state: { user_name: data.user_name, password: data.password },
          });
        }
      } catch (error) {
        if (error.response.status === 409) {
          toast.error("User already exists");
        } else {
          toast.error("Something went wrong");
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else if (check === 0) {
      toast("Fill up all the details", { icon: "⚠️" });
    } else if (check === 1) {
      toast("Enter a valid email address", { icon: "⚠️" });
    } else if (check === 2) {
      toast("Passwords do not match", { icon: "⚠️" });
    } else if (check === 3) {
      toast(
        "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        { icon: "⚠️" }
      );
    }
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="smM:w-[80vw] h-auto bg-white rounded-lg p-6 space-y-14 shadow-lg ">
        <h1 className="text-2xl font-semibold text-center">Register</h1>
        <div className="flex flex-col gap-y-4 ">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className="text-slate-500">
              Email *
            </label>
            <input
              value={data.user_name}
              onChange={handleInputChange}
              placeholder="e.g. johndoe@gmail.com"
              type="email"
              name="user_name"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <div className="flex smM:flex-col gap-8">
            <div className="flex flex-col gap-y-2 relative w-full">
              <label htmlFor="password" className="text-slate-500">
                Password *
              </label>
              <input
                value={data.password}
                placeholder="Password"
                onChange={handleInputChange}
                type={!showPassword ? "password" : "text"}
                name="password"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
              {!showPassword ? (
                <LuEyeOff
                  onClick={() => setShowPassword((prev) => !prev)}
                  size={18}
                  className="absolute bottom-3 right-3 cursor-pointer text-slate-400 bg-white"
                />
              ) : (
                <LuEye
                  onClick={() => setShowPassword((prev) => !prev)}
                  size={18}
                  className="absolute bottom-3 right-3 cursor-pointer text-slate-400 bg-white"
                />
              )}
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label htmlFor="password" className="text-slate-500">
                Confirm Password *
              </label>
              <input
                value={data.cnfPassword}
                placeholder="Confirm Password"
                onChange={handleInputChange}
                type="password"
                name="cnfPassword"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white w-full py-2 rounded-full"
          onClick={signup}
        >
          {loading ? loader : "Continue"}
        </button>
        <div className="flex flex-col gap-y-5">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link className="text-blue-500" to="/">
              {" "}
              Login now{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
