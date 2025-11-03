import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddMovie from "./pages/admin/AddMovie";
import ManageMovies from "./pages/admin/ManageMovies";
import UserManagement from "./pages/admin/UserManagement";
import RevenueReports from "./pages/admin/RevenueReports";
import MoviePlayer from "./pages/MoviePlayer";
import PaymentPage from "./pages/PaymentPage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/movie/:id/play",
        element: <MoviePlayer />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/subscription",
        element: <Subscription />,
      },
      {
        path: "/payment",
        element:<PaymentPage></PaymentPage>
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/add-movie",
        element: <AddMovie />,
      },
      {
        path: "/admin/manage-movies",
        element: <ManageMovies />,
      },
      {
        path: "/admin/users",
        element: <UserManagement />,
      },
      {
        path: "/admin/revenue",
        element: <RevenueReports />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);