import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { GoGraph } from "react-icons/go";
import { LuContainer } from "react-icons/lu";

import { useSelector } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const userRole = useSelector((state) => state.user.user.role);
//   const title = useSelector((state) => state.user.user.title).toLowerCase();
  return (
    <div className="bg-slate-800 w-[15rem] h-full fixed top-[4.1rem]">
      <div className=" flex flex-col gap-y-5 px-4 pt-4">
        <Link
          to={`/${userRole}/dashboard`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname == `/${userRole}/dashboard`
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <RxDashboard className="text-xl" />
          Dashboard
        </Link>


        <Link
          to={`/${userRole}/container-master`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/performance`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <LuContainer className="text-xl" />
          Containers
        </Link>


        {/* <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
          <FiUser className="text-xl" />
          Skills
        </Link>
        <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
          <GrInProgress />
          Improvement
        </Link>
        {userRole === "admin" && (
          <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
            <MdManageAccounts className="text-xl" />
            Managers
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;
