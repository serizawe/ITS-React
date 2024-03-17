import * as React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { BiUserCircle } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const CompanyNavbar = () => {
  const [Menu, setMenu] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="border-b mb-6 py-4 px-6 flex justify-between items-center gap-10  w-full mr-3">
      <div className="fixed flex items-center text-white font-bold text-3xl border-gray-400 top-0 left-0 w-full h-14 bg-[#1b3365]">
        &nbsp; &nbsp; ITS
        <div className="flex items-center absolute top-4 right-10 space-x-2 cursor-pointer">
          <Link to="/company/profile">
            <BiUserCircle size={30} color="white" />
          </Link>
          <Link to="/company/password">
            <RiLockPasswordLine size={30} color="white" />
          </Link>
          <div
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
          >
            <IoMdLogOut
              size={30}
              color={isLogoutHovered ? "red" : "white"}
              onClick={handleLogout}
              style={{
                transition: "color 0.3s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>
      <div className="fixed top-16 left-3" onClick={() => setMenu(!Menu)}>
        <RiMenuUnfoldLine className="cursor-pointer" size={35} />
      </div>
      <div
        className={
          Menu
            ? "fixed top-14 left-0 border-t-2 border-gray-400 w-[220px] h-[98vh] bg-[#1b3365] text-white shadow-2xl shadow-black z-10 duration-200"
            : "fixed top-0 left-[-100%] w-[240px] h-screen bg-white z-10 duration-200"
        }
      >
        <RiMenuFoldLine
          className="absolute right-2 top-1 cursor-pointer hover:text-[#9ad2ff] "
          onClick={() => setMenu(!Menu)}
          size={30}
        />
        <ul className="flex flex-col justify-around gap-20 mt-20">
          <li className="">
            <NavLink
              className="inline-block ml-5  text-xl border-white flex-col hover:text-[#9ad2ff]  transition-all ease-in-out"
              to={"/company/new"}
            >
              Create an announcement
            </NavLink>
          </li>
          <li className="">
            <NavLink
              className="inline-block ml-5  text-xl border-white hover:text-[#9ad2ff]  transition-all ease-in-out"
              to={"/company/application"}
            >
              Announcements
            </NavLink>
          </li>
          <li className="">
            <NavLink
              className="inline-block ml-5  text-xl border-white hover:text-[#9ad2ff]  transition-all ease-in-out"
              to={"/company/approved"}
            >
              Internships
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyNavbar;