
import { Outlet } from 'react-router';

export default function Display() {
  return (
     <div className="rounded-2xl   text-center text-slate-500 ">
          <Outlet/>
          </div>
  )
}
