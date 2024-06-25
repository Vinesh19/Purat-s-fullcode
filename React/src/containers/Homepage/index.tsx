import { useState } from "react";
import SignUpForm from "../../components/Signup";
import Login from "../../components/Login";
import ForgotPassword from "../../components/Forgot";

const Homepage = ({ setUser }) => {
    // Accept setUser as a prop
    const [currentForm, setCurrentForm] = useState("login");

    const renderForm = () => {
        switch (currentForm) {
            case "signup":
                return <SignUpForm onChangeForm={setCurrentForm} />;
            case "login":
                return (
                    <Login onChangeForm={setCurrentForm} setUser={setUser} />
                ); // Pass setUser to Login
            case "forgot":
                return <ForgotPassword onChangeForm={setCurrentForm} />;
            default:
                return (
                    <Login onChangeForm={setCurrentForm} setUser={setUser} />
                ); // Pass setUser to Login
        }
    };

    return (
        <div className="h-screen login bg-gradient-to-r from-[#ab1ab3d0] from-10% via-[#b764b0] via-30% to-[#9849cabc] to-90%">
            <h2 className="text-5xl text-center lg:text-left font-semibold text-white p-4">
                PuRat
            </h2>
            <div className="flex gap-12 items-center justify-center h-5/6">
                <div className="hidden basis-[44%] text-white lg:block">
                    <h3 className="text-2xl xl:text-3xl font-semibold mb-8">
                        All the essential elements for expanding your business
                        on WhatsApp
                    </h3>
                    <ul className="flex list-disc flex-col gap-3 pl-6 mb-4 text-lg xl:text-xl">
                        <li>
                            targeted campaigns to deliver personalized offers
                        </li>
                        <li>
                            Pre-built templates to send updates & remainders
                        </li>
                        <li>24x7 instant engagement with no code chatbots</li>
                        <li>Powerful automations to resolve issue later</li>
                        <li>
                            Integrations to bring in context from Zoho, Shopify
                            etc.
                        </li>
                    </ul>
                    <h3 className="text-xl xl:text-2xl font-semibold mb-3">
                        Trusted by 6000+ users across 52 countries{" "}
                    </h3>
                    <ul className="flex gap-5 font-medium xl:text-xl">
                        <li>
                            <img
                                src="/assets/images/svg/google.svg"
                                width={80}
                                height={80}
                            />
                        </li>
                        <li>
                            <img
                                src="/assets/images/svg/netflix.svg"
                                width={80}
                                height={80}
                            />
                        </li>
                        <li>
                            <img
                                src="/assets/images/svg/apple-logo.svg"
                                width={20}
                                height={80}
                            />
                        </li>
                        <li>
                            <img
                                src="/assets/images/svg/garmin_logo.svg"
                                width={80}
                                height={80}
                            />
                        </li>
                        <li className=" mt-[-24px]">
                            <img
                                src="/assets/images/svg/openai-logo.svg"
                                width={80}
                                height={80}
                            />
                        </li>
                    </ul>
                </div>

                <div className="m-[4%] xl:m-0 xl:basis-1/3 xl:max-w-[465px]">
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
