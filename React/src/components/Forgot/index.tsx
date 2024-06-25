import { useState } from "react";
import {
    requestEmailOtp,
    verifyEmailOtp,
    changePassword,
} from "../../services/api";

const Forgot = ({ onChangeForm }) => {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await requestEmailOtp(email);
            setStep("otp");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to send OTP. Please try again."
            );
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await verifyEmailOtp(email, otp);
            setStep("password");
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid OTP. Please try again."
            );
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await changePassword(email, newPassword, confirmPassword);
            onChangeForm("login");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to update password. Please try again."
            );
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="flex justify-center items-center">
            <div className="flex flex-col rounded-2xl bg-[#000000ae] text-[#dbd4d4] px-7 py-6 shadow-2xl text-sm xs:text-base">
                <h2 className="text-center text-xl md:text-2xl font-medium">
                    Forgot your Password?
                </h2>

                {step === "email" && (
                    <>
                        <h3 className="text-center sm:text-lg font-medium my-4">
                            Please enter your email address
                        </h3>
                        <label className="my-3 flex flex-col">
                            Email Address:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="mt-2 rounded-lg p-2 text-black outline-none"
                            />
                        </label>
                        <button
                            onClick={handleSendOtp}
                            className="my-3 rounded-3xl bg-[#339e23] py-2 font-medium text-white"
                        >
                            Send OTP
                        </button>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <h3 className="text-center sm:text-lg font-medium my-4">
                            Enter the OTP sent to your email
                        </h3>
                        <label className="my-3 flex flex-col">
                            OTP:
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="mt-2 rounded-lg p-2 text-black outline-none"
                            />
                        </label>
                        <button
                            onClick={handleVerifyOtp}
                            className="my-3 rounded-3xl bg-[#339e23] py-2 font-medium text-white"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                {step === "password" && (
                    <>
                        <div className="relative">
                            <label className="mt-3 flex flex-col font-medium sm:text-lg">
                                Password :
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
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

                        <div className="relative">
                            <label className="mt-3 flex flex-col font-medium sm:text-lg">
                                Confirm Password :
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
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

                        <button
                            onClick={handleUpdatePassword}
                            className="my-3 rounded-3xl bg-[#339e23] py-2 font-medium text-white"
                        >
                            Change Password
                        </button>
                    </>
                )}

                {error && <p className="text-center text-red-500">{error}</p>}

                <p className="text-center font-bold cursor-pointer text-zinc-400">
                    Take me to Login Page{" "}
                    <span
                        onClick={() => onChangeForm("login")}
                        className="text-[#339e23]"
                    >
                        Login
                    </span>
                </p>
            </div>
        </form>
    );
};

export default Forgot;
