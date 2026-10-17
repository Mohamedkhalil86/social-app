import { createBrowserRouter } from "react-router";

import NotFound from "../Pages/NotFound/NotFound";
import Layout from "../Components/Layout/Layout";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import AuthProtected from "../Components/AuthProtected/AuthProtected";
import Feed from "../Pages/Feed/Feed";


import Profilepage from "./../Pages/profilepage/profilepage";
import Notifications from "../Pages/Notifications/Notifications";
import Settings from "../Pages/Settings/Settings";
import Sign from "../Pages/sign/Sign";
import Forgotpassword from "../Pages/Forgotpassword/Forgotpassword";
import Myposts from "../Pages/Myposts/Myposts";
import Mysaved from "../Pages/Mysaved/Mysaved";
import Comunity from "../Pages/Comunity/Comunity";
import Homefeed from "../Components/Homefeed/Homefeed";
import Post from "../Components/Post/Post";
import PostDetailsPage from "../Pages/PostDetailsPage/PostDetailsPage";
import AllSuggestions from "../Components/Sugfrinds/AllSuggestions";
import Mysave from "../Components/Mysave/Mysave";
import Mypostfi from "../Components/Mypostfi/Mypostfi";
import Userpro from "../Components/Userpro/Userpro";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <ProtectedRoute><Feed /></ProtectedRoute>,
        children: [
          { index: true, element: <Homefeed /> },
          
          { path: "myposts", element: <ProtectedRoute><Myposts /></ProtectedRoute> },
          { path: "mysave", element:  <ProtectedRoute><Mysaved/></ProtectedRoute> },
          { path: "comuntiy", element:  <ProtectedRoute><Comunity /></ProtectedRoute> },
        ],
      },

      {
        path: "profile",
        element: <Profilepage/>,
        children: [
          
          
          {  index: true, element: <Mypostfi /> },
           {  path:"postfi", element: <Mypostfi /> },
          { path: "save", element: <Mysave /> }
        ]
      },
      { path: "posts", element: <ProtectedRoute><Feed /></ProtectedRoute> },
      { path: "Notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
       { path: "post", element: <ProtectedRoute><Post /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><Profilepage /></ProtectedRoute> },
      { path: "Settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
      { path: "Forgotpassword", element: <AuthProtected><Forgotpassword /></AuthProtected> },
      { path: "Sign", element: <AuthProtected><Sign /></AuthProtected> },
     {  path: "/post/:postId", element: <ProtectedRoute><PostDetailsPage /></ProtectedRoute> },
     {  path: "all-suggestions", element: <ProtectedRoute><AllSuggestions /></ProtectedRoute> },
      {  path: "Userpro/:userId", element: <ProtectedRoute><Userpro /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);