import { Outlet } from "react-router"
import Navbar from "../Navbar/Navbar"
import { Toaster } from "react-hot-toast"

function Layout() {

    return (
        <>

        <Navbar/>
        <div className="bg-gray-200 min-h-screen flex justify-center items-center flex-col pt-20">
            
        <Outlet />
        <Toaster />
        </div>

        </>
    )
}

export default Layout
