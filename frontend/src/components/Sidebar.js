import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { GoGraph } from "react-icons/go";
import {
  LuContainer,
  LuUserSquare,
  LuCaseUpper,
  LuLayers,
} from "react-icons/lu";
import { TbReport } from "react-icons/tb";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const userRole = useSelector((state) => state.user.user.role);
  return (
    <div className="bg-slate-800 w-[15rem] h-screen fixed top-[4.1rem]">
      <div className=" flex flex-col gap-y-5 px-4 pt-4  overflow-y-auto">
        <Link
          to={`/${userRole}/dashboard`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
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
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/container-master`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <LuContainer className="text-xl" />
          Containers
        </Link>

        <Link
          to={`/${userRole}/user-master`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname == `/${userRole}/user-master`
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <LuUserSquare className="text-xl" />
          Users
        </Link>

        <Link
          to={`/${userRole}/sku-master`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname == `/${userRole}/sku-master`
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <LuCaseUpper className="text-xl" />
          SKUs
        </Link>

        <Link
          to={`/${userRole}/business-entity-master`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname == `/${userRole}/business-entity-master`
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <LuLayers className="text-xl" />
          Business Entities
        </Link>

        <Link
          to={`/${userRole}/reports/1`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/reports/1`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbReport className="text-xl" />
          Report 1
        </Link>
        <Link
          to={`/${userRole}/reports/2`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/reports/2`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbReport className="text-xl" />
          Report 2
        </Link>
        <Link
          to={`/${userRole}/reports/3`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/reports/3`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbReport className="text-xl" />
          Report 3
        </Link>
        <Link
          to={`/${userRole}/reports/4`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/reports/4`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbReport className="text-xl" />
          Report 4
        </Link>
        <Link
          to={`/${userRole}/container/search`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/container/search`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbReport className="text-xl" />
          Search
        </Link>
        <Link
          to={`/${userRole}/container/movement`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-1 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/container/movement`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbReport className="text-xl" />
          History
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
