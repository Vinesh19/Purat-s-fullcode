import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, requestMobileOtp, verifyMobileOtp } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onChangeForm, setUser }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);
    const [isMobileLogin, setIsMobileLogin] = useState(false);
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpRequested, setOtpRequested] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [captcha1, setCaptcha1] = useState(0);
    const [captcha2, setCaptcha2] = useState(0);
    const [captchaInput, setCaptchaInput] = useState("");
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);

    const navigate = useNavigate();

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        setCaptcha1(num1);
        setCaptcha2(num2);
        setCaptchaInput("");
        setIsCaptchaValid(false);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleMobileNumberChange = (e) => {
        setMobileNumber(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleCaptchaChange = (e) => {
        const value = e.target.value;
        setCaptchaInput(value);
        setIsCaptchaValid(parseInt(value) === captcha1 + captcha2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isCaptchaValid) {
            toast.error("CAPTCHA INVALID");
            return;
        }

        if (isMobileLogin) {
            if (!otpRequested) {
                // Request OTP
                try {
                    await requestMobileOtp(mobileNumber);
                    setOtpRequested(true);
                    setErrorMessage("OTP sent to your mobile number.");
                    setIsEmailDisabled(true);
                    toast.success("OTP sent to your mobile number.");
                } catch (error) {
                    setErrorMessage(
                        error.response?.data?.message || "Failed to send OTP"
                    );
                    toast.error(
                        error.response?.data?.message || "Failed to send OTP"
                    );
                }
            } else {
                // Verify OTP and login
                try {
                    const response = await verifyMobileOtp(mobileNumber, otp);
                    console.log("Login successful", response?.data);

                    // Store the token and user data in localStorage
                    localStorage.setItem("token", response?.data?.token);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response?.data?.user)
                    );

                    // Update the user state
                    setUser(response?.data?.user);

                    // Redirect to the Dashboard
                    navigate("/dashboard", { replace: true });
                } catch (error) {
                    console.error("Error logging in", error);
                    setErrorMessage(error?.response?.data?.message);
                    toast.error(
                        error?.response?.data?.message || "Failed to verify OTP"
                    );
                }
            }
        } else {
            try {
                const response = await login({
                    email_or_username: email,
                    password,
                });
                console.log("Login successful", response.data);

                // Store the token and user data in localStorage
                localStorage.setItem("token", response?.data?.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response?.data?.user)
                );

                // Update the user state
                setUser(response?.data?.user);

                // Redirect to the Dashboard
                navigate("/dashboard", { replace: true });
            } catch (error) {
                console.error("Error logging in", error);
                setErrorMessage(error?.response?.data?.message);
                toast.error(
                    error?.response?.data?.message || "Failed to login"
                );
            }
        }
    };

    return (
        <form
            className="flex flex-col rounded-2xl bg-[#000000ae] text-[#dbd4d4] px-7 py-6 shadow-2xl text-sm xs:text-base"
            onSubmit={handleSubmit}
        >
            <ToastContainer />
            <h2 className="text-center text-xl sm:text-2xl font-medium">
                Log in to your account
            </h2>

            <h3 className="text-center sm:text-lg font-medium">
                Welcome back! Please log in with your credential
            </h3>

            {errorMessage && (
                <div className="mb-4 text-red-500 text-center">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col xs:flex-row gap-2 xs:justify-between mt-4">
                <button
                    type="button"
                    className={`px-6 py-1 flex items-center justify-center gap-1 border border-[#3a5663] rounded-lg ${
                        !isMobileLogin && "outline outline-1 outline-[#5d7281]"
                    }`}
                    onClick={() => {
                        setIsMobileLogin(false);
                        setOtpRequested(false);
                        setErrorMessage("");
                        setIsEmailDisabled(false);
                    }}
                >
                    <img
                        src="/assets/images/svg/profile.svg"
                        width={16}
                        height={16}
                        alt="logo"
                    />
                    Username
                </button>

                <button
                    type="button"
                    className={`px-6 py-1 flex items-center justify-center gap-1 border border-[#3a5663] rounded-lg ${
                        isMobileLogin && "outline outline-1 outline-[#5d7281]"
                    }`}
                    onClick={() => {
                        setIsMobileLogin(true);
                        setOtpRequested(false);
                        setErrorMessage("");
                    }}
                >
                    <img
                        src="/assets/images/svg/apple.svg"
                        width={16}
                        height={16}
                        alt="logo"
                    />
                    Mobile Number
                </button>
            </div>

            {!isMobileLogin && (
                <div>
                    <label className="mt-4 flex flex-col sm:text-lg font-medium">
                        Email / Username :
                        <input
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="example@email.com"
                            className="mt-1 rounded-lg p-2 text-black outline-none text-base font-normal"
                            disabled={isEmailDisabled}
                            required
                        />
                    </label>

                    <div className="relative">
                        <label className="mt-3 flex flex-col font-medium sm:text-lg">
                            Password :
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="********"
                                className="mt-1 rounded-lg p-2 text-black outline-none text-base font-normal"
                                required
                            />
                            <img
                                src="/assets/images/svg/password-eye-icon.svg"
                                width={20}
                                height={20}
                                alt="eye-icon"
                                className="absolute right-4 bottom-2.5 cursor-pointer"
                                onClick={handleShowPassword}
                            />
                        </label>
                    </div>

                    <div className="flex justify-between mt-3">
                        <label className="cursor-pointer flex gap-1 items-baseline">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => onChangeForm("forgot")}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    <div>
                        <h4 className="pt-3 pb-2 font-medium text-center text-lg">
                            Or Login with:
                        </h4>

                        <div className="flex justify-evenly">
                            <a
                                href="https://www.google.com/"
                                className="flex items-center justify-center gap-2 px-3 py-1 border border-[#3a5663] hover:border-[#5d7281] rounded-3xl"
                            >
                                <img
                                    src="/assets/images/svg/gmail.svg"
                                    width={16}
                                    height={16}
                                    alt="logo"
                                />
                                Google
                            </a>
                            <a
                                href="https://www.facebook.com/"
                                className="flex items-center justify-center gap-2 px-3 py-1 border border-[#3a5663] hover:border-[#5d7281] rounded-3xl"
                            >
                                <img
                                    src="/assets/images/svg/logosfacebook.svg"
                                    width={16}
                                    height={16}
                                    alt="logo"
                                />
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {isMobileLogin && (
                <div>
                    <label className="mt-4 flex flex-col font-medium sm:text-lg">
                        Registered Mobile Number :
                        <input
                            type="tel"
                            value={mobileNumber}
                            onChange={handleMobileNumberChange}
                            placeholder="Enter mobile number"
                            className="mt-1 rounded-lg p-2 text-black outline-none font-normal text-base"
                            disabled={otpRequested}
                            required
                        />
                    </label>
                    {otpRequested && (
                        <label className="mt-4 flex flex-col font-medium sm:text-lg">
                            Enter OTP:
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="Enter OTP"
                                className="mt-1 rounded-lg p-2 text-black outline-none"
                                required
                            />
                        </label>
                    )}
                </div>
            )}

            <div className="mt-4">
                <label className="flex gap-5 justify-center items-center text-lg">
                    captcha :
                    <span className="text-xl">
                        {captcha1} + {captcha2} =
                    </span>
                    <input
                        type="text"
                        className="rounded-md px-2 py-1 border border-gray-300 outline-none text-gray-700 w-24"
                        value={captchaInput}
                        onChange={handleCaptchaChange}
                        required
                    />
                    <button type="button" onClick={generateCaptcha}>
                        <img
                            src="/assets/images/png/refresh_captcha.png"
                            width={20}
                            height={20}
                        />
                    </button>
                </label>
            </div>

            <button
                type="submit"
                className="mb-3 mt-5 rounded-3xl bg-[#EB1313] py-2 font-medium text-white"
            >
                {otpRequested ? "Login" : isMobileLogin ? "Send OTP" : "Login"}
            </button>

            <p className="text-center">
                Don't have an account?{" "}
                <span
                    className="font-bold cursor-pointer"
                    onClick={() => onChangeForm("signup")}
                >
                    Sign up
                </span>
            </p>
        </form>
    );
};

export default Login;
