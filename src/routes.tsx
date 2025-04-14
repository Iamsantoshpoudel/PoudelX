import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Loader from "./components/Loader";

// Lazy load pages
const Chat = lazy(() => import("./pages/Chat"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/login"));
const UserList = lazy(() => import("./pages/UserList"));
const Profile = lazy(() => import("./pages/Profile"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth/signup",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Suspense fallback={<Loader />}>
          <Signup />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chat",
        element: (
          <Suspense>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: "chat/:id",
        element: (
          <Suspense>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: "userlist",
        element: (
          <Suspense fallback={<Loader />}>
            <UserList />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "profile/:id",
        element: (
          <Suspense>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
