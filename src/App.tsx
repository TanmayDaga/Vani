import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import AxiosContext from "./Hooks/useAxiosContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { WindowDimensionsProvider } from "./Hooks/useWindowDimensions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiError } from "./types/ApiError";
import { AuthContextProvider, AuthContextType } from "./Hooks/useAuthContext";
import { DEFAULT_SESSION_ID } from "./util/constant";

const App: FC = () => {
  const [primaryValues, setPrimaryValues] = useState<
    AuthContextType["primaryValues"]
  >({
    loggedIn: false,
    id: DEFAULT_SESSION_ID,
    email: "",
    voice: "Deepgram",
  });
  const axiosInstance = axios.create({
    baseURL: "https://backend.vanii.ai/auth",
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError): Promise<ApiError> => {
      const apiError: ApiError = error.response?.data as ApiError;
      return Promise.reject(apiError);
    }
  );

  const queryClient = new QueryClient();

  return (
    <AuthContextProvider values={{ primaryValues, setPrimaryValues }}>
      <QueryClientProvider client={queryClient}>
        <AxiosContext.Provider value={axiosInstance}>
          <WindowDimensionsProvider>
            <AppRoutes />
          </WindowDimensionsProvider>
        </AxiosContext.Provider>
        <ToastContainer autoClose={1500} />
      </QueryClientProvider>
    </AuthContextProvider>
  );
};

export default App;
