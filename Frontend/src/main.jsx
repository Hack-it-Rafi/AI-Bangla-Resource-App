import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Login from "./Components/Authentication/Login";
import Root from "./Components/Root";
import AuthProvider from "./Components/Authentication/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUp from "./Components/Authentication/SignUp";
import Profile from "./Components/Pages/Profile";
import AllHome from "./Components/Pages/AllHome";
import Start from "./Components/Pages/Start";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/root",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "home",
        element: (
          // <PrivateRoute>
          <AllHome></AllHome>
          // </PrivateRoute>
        ),
      },
      {
        path: "profile/:id",
        element: (
          // <PrivateRoute>
          <Profile></Profile>
          // </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login></Login>,
  },
  {
    path: "signup",
    element: <SignUp></SignUp>,
  },
  {
    path: "/",
    element: (
      <Start></Start>
    ),
    errorElement: <ErrorPage></ErrorPage>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
