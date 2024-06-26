import { useNavigate } from "react-router-dom";
import { logout } from "../../services/api";

const Dashboard = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleWhatsAppClick = () => {
        navigate("/dashboard/whatsapp");
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("user");
            localStorage.removeItem("token"); // If you have a token
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Failed to logout:", error);
            // Optionally, handle error display to the user here
        }
    };

    return (
        <div className="font-sans p-4 sm:p-8 antialiased">
            <header className="sticky bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-300 shadow-md shadow-neutral-400">
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-100 shadow-md">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
                            <a
                                href="#"
                                className="p-3 text-xl font-semibold rounded lg:bg-transparent text-purple-700 lg:p-0"
                            >
                                PuRat
                            </a>
                        </div>

                        <div className="flex items-center lg:order-2">
                            <button
                                onClick={handleLogout}
                                className="text-purple-800 hover:bg-gray-100 dark:hover:bg-purple-700 hover:text-white hover:shadow-md focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:focus:ring-gray-800"
                            >
                                Log Out
                            </button>
                            <a
                                href="#"
                                className="text-white bg-purple-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                            >
                                Get started
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="max-w-4xl flex flex-col items-center mx-auto mt-8 sm:mt-15 bg-gray-100 p-4 sm:p-8 rounded-t-lg shadow-lg hover:bg-black-100">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Hi,{" "}
                    <span id="userName" className="text-black">
                        {user?.username}
                    </span>
                </h1>

                <div className="mt-4 sm:mt-7 grid gap-8 sm:grid-cols-2">
                    <button
                        id="manageApiKeys"
                        className="py-2 bg-blue-100 text-blue-800 rounded shadow-lg hover:bg-blue-70 w-full"
                    >
                        Manage API Keys
                    </button>

                    <div className="p-2 bg-blue-100 text-blue-800 rounded shadow-lg">
                        <div className="flex items-center justify-between">
                            <span>API Base URL:</span>
                            <button className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
                <h3 className="text-2xl font-semibold mt-8 mb-4 text-center">
                    Channels
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* Email */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/mail.svg"
                            alt="Email Icon"
                            className="w-8 h-10 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Email
                        </h4>
                    </div>
                    {/* SMS */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/chat.svg"
                            alt="SMS Icon"
                            className="w-6 h-5 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            SMS
                        </h4>
                    </div>
                    {/* Voice */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/voice-recognition.svg"
                            alt="Voice Icon"
                            className="w-7 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Voice
                        </h4>
                    </div>
                    {/* WhatsApp */}
                    <div
                        className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer"
                        onClick={handleWhatsAppClick}
                    >
                        <img
                            src="/assets/images/svg/whatsapp.svg"
                            alt="WhatsApp Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            WhatsApp
                        </h4>
                    </div>
                    {/* RCS */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/rcs.svg"
                            alt="RCS Icon"
                            className="w-9.5 h-8 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            RCS
                        </h4>
                    </div>
                    {/* Numbers */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/four.svg"
                            alt="Numbers Icon"
                            className="w-8 h-7 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Numbers
                        </h4>
                    </div>
                    {/* Push Notifications */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/notification-bell.svg"
                            alt="Push Notifications Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Push Notifications
                        </h4>
                    </div>
                </div>

                <h3 className="text-2xl font-semibold mt-8 mb-4 text-center">
                    Utilities
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* Knowledgebase */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/learning.svg"
                            alt="Knowledgebase Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Knowledgebase
                        </h4>
                    </div>
                    {/* URL Shortener */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/search-engine.svg"
                            alt="URL Shortener Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            URL Shortener
                        </h4>
                    </div>
                    {/* File Hosting */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/file-storage.svg"
                            alt="File Hosting Icon"
                            className="w-7 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            File Hosting
                        </h4>
                    </div>
                    {/* Reports */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/statistics.svg"
                            alt="Reports Icon"
                            className="w-7 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Reports
                        </h4>
                    </div>
                </div>

                <h3 className="text-2xl font-semibold mt-8 mb-4 text-center">
                    Plugins & Integrations
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* Shopify */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/logosshopify.svg"
                            alt="Shopify Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Shopify
                        </h4>
                    </div>
                    {/* Freshworks */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/freshworks.svg"
                            alt="Freshworks Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Freshworks
                        </h4>
                    </div>
                    {/* Zapier */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/zapier.svg"
                            alt="Zapier Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Zapier
                        </h4>
                    </div>
                    {/* Google Sheets */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/googlesheet.svg"
                            alt="Google Sheets Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Google Sheets
                        </h4>
                    </div>
                    {/* Microsoft Excel */}
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer">
                        <img
                            src="/assets/images/svg/msexcel.svg"
                            alt="Microsoft Excel Icon"
                            className="w-6 h-6 mr-4"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Microsoft Excel
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
