import { useState } from "react";
import { signUp } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    mobile_no: "",
    password: "",
    password_confirmation: "",
};

const SignUpForm = ({ onChangeForm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleConfirmPassword = () => {
        setConfirmPassword(!confirmPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setErrorMessage("Passwords do not match!");
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await signUp({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                username: formData.username,
                mobile_no: formData.mobile_no,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            const { data } = response || {};
            const { message, token } = data || "";

            if (message) {
                // Store the token in local storage
                localStorage.setItem("token", token);

                // Clear the form fields and error message
                setFormData(initialFormData);
                setErrorMessage("");

                // Show success toast
                toast.success(message, {
                    position: "top-right",
                    autoClose: 1300,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Change the form to the login form
                setTimeout(() => onChangeForm("login"), 1500);
            } else {
                // In case there is no message in the response
                throw new Error(
                    "Registration successful but no message received."
                );
            }
        } catch (error) {
            console.error("Error signing up", error.response?.data);
            if (error.response?.data?.message) {
                const errorMessages = Object.values(error.response.data.message)
                    .flat()
                    .join("\n");
                toast.error(errorMessages);
            } else {
                setErrorMessage(
                    "An error occurred during sign up. Please try again."
                );
                toast.error(
                    "An error occurred during sign up. Please try again."
                );
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <form
                className="flex flex-col gap-2 rounded-2xl bg-[#000000ae] text-[#dbd4d4] px-7 py-6 shadow-2xl text-sm xs:text-base"
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-medium text-center md:text-2xl">
                    Start Free Trial
                </h2>
                <h3 className="font-medium text-center">
                    Get started with a demo account on Wati
                </h3>

                <div className="flex flex-col gap-2 xs:gap-4 xs:flex-row">
                    <label className="flex flex-col mt-4">
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="First name"
                            className="rounded-lg px-2 py-1.5 text-black outline-none"
                        />
                    </label>

                    <label className="flex flex-col xs:mt-4">
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Last name"
                            className="rounded-lg px-2 py-1.5 text-black outline-none"
                        />
                    </label>
                </div>

                <label className="flex flex-col xs:mt-4">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="rounded-lg px-2 py-1.5 text-black outline-none"
                    />
                </label>

                <label className="flex flex-col xs:mt-4">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="username"
                        className="rounded-lg px-2 py-1.5 text-black outline-none"
                    />
                </label>

                <label className="flex flex-col xs:mt-4">
                    <input
                        type="text"
                        name="mobile_no"
                        value={formData.mobile_no}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        className="rounded-lg px-2 py-1.5 text-black outline-none"
                    />
                </label>

                <div className="flex flex-col gap-2 xs:gap-4 xs:flex-row">
                    <div className="relative">
                        <label className="flex flex-col xs:mt-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="rounded-lg px-2 py-1.5 text-black outline-none"
                            />
                            <img
                                src="/assets/images/svg/password-eye-icon.svg"
                                width={20}
                                height={20}
                                alt="eye-icon"
                                className="absolute cursor-pointer right-2 bottom-2"
                                onClick={handleShowPassword}
                            />
                        </label>
                    </div>

                    <div className="relative">
                        <label className="flex flex-col xs:mt-4">
                            <input
                                type={confirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="rounded-lg px-2 py-1.5 text-black outline-none"
                            />
                            <img
                                src="/assets/images/svg/password-eye-icon.svg"
                                width={20}
                                height={20}
                                alt="eye-icon"
                                className="absolute cursor-pointer right-2 bottom-2"
                                onClick={handleConfirmPassword}
                            />
                        </label>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}

                <h4 className="pt-3 pb-2 font-medium text-center">
                    Or Sign up with:
                </h4>

                <div className="flex justify-evenly">
                    <a
                        href="https://www.google.com/"
                        className="flex items-center justify-center gap-2 px-3 py-1.5 text-black bg-white rounded-3xl"
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
                        className="flex items-center justify-center gap-2 px-3 py-1.5 text-black bg-white rounded-3xl"
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

                <button
                    type="submit"
                    className="mb-2 mt-4 rounded-3xl bg-[#f81c1c] py-2 font-medium"
                >
                    Start my Trial
                </button>

                <p className="text-center">
                    Already have an account?{" "}
                    <span
                        className="font-bold cursor-pointer"
                        onClick={() => onChangeForm("login")}
                    >
                        Sign in
                    </span>
                </p>
            </form>
        </>
    );
};

export default SignUpForm;
