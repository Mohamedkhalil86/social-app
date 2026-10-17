import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./AppRouter/AppRouter";

import UserAuthProvider from "./Context/UserAuthProvider/UserAuthProvider";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
   

     <UserAuthProvider>
      
        <RouterProvider router={router} />
      
    </UserAuthProvider>
   
  </StrictMode>,
);
