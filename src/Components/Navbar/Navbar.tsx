
import myImage from "../../assets/route.png";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  

  
  const { userData, setUserData } = useContext(UserAuthContext);
  const router = useNavigate();

  function handleAvatar() {
    setIsOpen(!isOpen);
  }

 

  function handleLogOut() {
    localStorage.removeItem("user_tkn");
    setUserData(null);
    setIsOpen(false);
    router("/login");
  }

  return (
    <nav className="bg-white fixed w-full z-20 top-0 inset-s-0 border-b border-default shadow-2xl">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* اللوجو */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex gap-3 items-center">
            <img className="w-10 rounded-[25%]" src={myImage} alt="Logo" />
            <h1 className="font-bold text-[20px]">Route Posts</h1>
          </div>
        </Link>

        {/* الجزء الأيمن (البروفايل أو أزرار الدخول) */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {userData ? (
            <div className="relative">
              
              {/* زر البروفايل */}
              <button
                onClick={handleAvatar}
                type="button"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100 cursor-pointer "
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open user menu</span>
                <img alt="user-name" className="h-8 w-8 rounded-full object-cover" src={userData.photo} />
                <span className="hidden max-w-35 truncate text-sm font-semibold text-slate-800 md:block">{userData.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu text-slate-500" aria-hidden="true">
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <button onClick={() => setIsOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user" aria-hidden="true">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                   <Link to="/profile"> Profile</Link>
                  </button>
                  
                  <button onClick={() => setIsOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings" aria-hidden="true">
                      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                      <circle cx={12} cy={12} r={3} />
                    </svg>
                    <Link to="/Settings">Settings</Link>
                     
                  </button>

                    
               

                  

                  <div className="my-1 border-t border-slate-200" />
                  
                  <button onClick={handleLogOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="flex gap-3">
             
            </div>
          )}
        </div>

        
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
            {userData && (
              <li>
                <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
                  
                 
                  <NavLink 
                    to="/" 
                    end
                    className={({ isActive }) => 
                      `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                        isActive 
                          ? "bg-white text-[#1f6fe5]" 
                          : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
                      }`
                    }
                    data-discover="true"
                  >
                    <span className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house" aria-hidden="true">
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">Feed</span>
                    <span className="sr-only sm:hidden">Feed</span>
                  </NavLink>

                  
                  <NavLink 
                    to="/Profile" 
                    className={({ isActive }) => 
                      `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                        isActive 
                          ? "bg-white text-[#1f6fe5]" 
                          : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
                      }`
                    }
                    data-discover="true"
                  >
                    <span className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user" aria-hidden="true">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">Profile</span>
                    <span className="sr-only sm:hidden">Profile</span>
                  </NavLink>

                  
                  <NavLink 
                    to="/Notifications" 
                    className={({ isActive }) => 
                      `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                        isActive 
                          ? "bg-white text-[#1f6fe5]" 
                          : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
                      }`
                    }
                    data-discover="true"
                  >
                    <span className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle" aria-hidden="true">
                        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">Notifications</span>
                    <span className="sr-only sm:hidden">Notifications</span>
                  </NavLink>

                </div>
              </li>
            )}
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;