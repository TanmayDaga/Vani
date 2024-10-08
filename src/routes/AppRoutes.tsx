import { FC, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import Signup from "./Signup";
import Blogs from "./Blogs";
import BlogDetail from "./BlogsDetail";
import Record from "./Record";
import Home from "./Home";
import HealthCheck from "./HealthCheck";
import useAuthContext from "@/Hooks/useAuthContext";
import { useAxiosContext } from "@/Hooks/useAxiosContext";
import GetUser from "@/services/Login/GetUser";
import { DEFAULT_SESSION_ID, NOT_LOGGED_IN_EMAIL } from "@/util/constant";
import ForgotPassword from "./ForgotPassword";
import Onboarding from "./Onboarding";

const AppRoutes: FC = () => {
  const auth = useAuthContext();
  const axios = useAxiosContext();
  useEffect(() => {
    GetUser(undefined, axios)
      .then((data) => {
        auth?.setPrimaryValues({
          loggedIn: true,
          id: data.data.user._id,
          email: data.data.user.email,
          voice: data.data.user.voice,
        });
      })
      .catch((err: any) => {
        console.log(err);
        auth?.setPrimaryValues({
          loggedIn: false,
          id: DEFAULT_SESSION_ID,
          email: NOT_LOGGED_IN_EMAIL,
          voice: "",
        });
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/blogs"
            element={
              <Layout>
                <Blogs />
              </Layout>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <Layout>
                <BlogDetail />
              </Layout>
            }
          />

          <Route
            path="/record"
            element={
              <Layout>
                <Record />
              </Layout>
            }
          />
          <Route path="/health-check" element={<HealthCheck />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
