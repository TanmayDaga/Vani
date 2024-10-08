import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import bgImg from "../Images/bg.png";
import { useAxiosContext } from "../Hooks/useAxiosContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import login from "@/services/Login/Login";
import useAuthContext from "@/Hooks/useAuthContext";
import { countryCodesObject } from "@/Components/Signup/CountryCode";
import PhoneNumberInput from "@/Components/PhoneNo";

const Login: FC = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState<string>("+1");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (auth?.primaryValues.loggedIn) {
        toast.success("You are already loggedIn. Navigating to Home Page");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    }, 1500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [auth, navigate]);

  useEffect(() => {
    axios
      .get("https://api.country.is/", { withCredentials: false })
      .then((data) => {
        setCountryCode(countryCodesObject[data.data.country].code);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [formData, setFormData] = useState<{ phone: string; password: string }>(
    { phone: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const axios = useAxiosContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await login(
        { ...formData, phone: `${countryCode}${formData.phone}` },
        axios
      );

      if (response.success) {
        auth?.setPrimaryValues({
          loggedIn: true,
          id: response.data._id,
          email: "",
          voice: "",
        });
        toast.success("Login Successful. Navigating to Home Page");
        // @ts-expect-error - it may exists 
        if (window.dataLayer) {
            // @ts-expect-error - it may exists 
          window.dataLayer.push({
            user_id: response.data._id,
          });
        }
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error("An unknown error occured");
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex md:flex-row max-md:flex-col max-md:space-y-24">
        <div className="relative md:w-3/5 md:h-screen max-md:w-full max-md:h-2/5">
          <img src={bgImg} alt="bgImg" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center items-center md:w-3/5 max-md:w-full p-4">
          <div className="w-full max-w-md">
            <h2 className="text-3xl text-center mb-8">
              Log in to your account
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <PhoneNumberInput
                  countryCode={countryCode}
                  onCountryCodeChange={setCountryCode}
                  phoneNumber={formData.phone}
                  onPhoneNumberChange={(val: string) => {
                    setFormData((prevValues) => {
                      return {
                        ...prevValues,
                        phone: val,
                      };
                    });
                  }}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errorMessage && (
                <div className="mb-4">
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
              )}
              <div className="flex flex-row justify-between items-center mb-6">
                <div className="flex flex-col gap-2">
                  <a
                    href="#"
                    className="text-sm underline underline-offset-2 text-orange-500 hover:underline"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Create account
                  </a>
                  <a
                    href="#"
                    className="text-sm underline underline-offset-2 text-orange-500 hover:underline"
                    onClick={() => {
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot password
                  </a>
                </div>
                <button
                  type="submit"
                  className="px-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
