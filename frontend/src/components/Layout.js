import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="">
      <Navbar />
      <Sidebar />
      <div className="ml-[16rem] mt-[4.5rem]  p-3">{children}</div>
    </div>
  );
};

export default Layout;
