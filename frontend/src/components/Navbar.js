import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import Popup from "./Popup";
import { IoMdPerson, IoIosLogOut, IoIosSettings } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { axiosConfig } from "../axios/axiosConfig";
import { addUser, setIsSessionLoaded, setLoggedin } from "../store/features/common/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  //Logout function
  async function logout() {
    const res = await axiosConfig.post("/auth/logout");
    dispatch(addUser({}));
    dispatch(setLoggedin(false));
    dispatch(setIsSessionLoaded(false));
    navigate("/");
  }
  //Menu List
  const menuList = [
    {
      icon: <IoIosSettings />,
      name: "Settings",
    },
    {
      icon: <IoIosLogOut />,
      name: "Logout",
      function: logout,
    },
  ];
  //Profile
  const others = (
    <div className="py-2 flex flex-col justify-center items-center gap-y-3">
      <div className="w-full flex items-center justify-center gap-x-3 relative h-[2rem]">
        <hr className="w-full border-slate-300" />
        <IoMdPerson className="bg-blue-500 text-4xl p-2 rounded-full text-white absolute" />
      </div>
      <div className="pb-3">
        <p className="text-center text-slate-700">
          {user.first_name} {user.last_name}
        </p>
        <span className="text-[11px] mb-1 text-slate-600 block text-center">
          ({user.title})
        </span>
        <p className="text-center text-xs text-slate-600">{user.email}</p>
      </div>
    </div>
  );

  return (
    <div className="py-4 px-6 rounded-md fixed w-full bg-white top-0 shadow-md flex justify-between z-40">
      <h1 className="font-semibold text-xl text-slate-800"> Pago People</h1>
      <div className="flex justify-end text-sm ">
        <Popup
          menuList={menuList}
          align="-left-[8rem]"
          size="w-[10rem]"
          others={others}
        >
          <div className="text-slate-800 p-1 rounded-full hover:bg-slate-200">
            <VscAccount className="text-xl" />
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default Navbar;
