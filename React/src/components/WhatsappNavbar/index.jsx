import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../services/api";

const WhatsappNavbar = ({ user, setUser }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("Broadcast");
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex justify-between shadow-md">
                <div className="flex items-center mx-4 my-1">
                    <div className="lg:hidden">
                        <i className="fas fa-bars"></i>
                    </div>

                    <button
                        className="btn btn-ghost text-4xl"
                        onClick={() => navigate("/dashboard")}
                    >
                        PuRat
                    </button>
                </div>

                <div className="hidden lg:flex items-center">
                    <ul className="menu menu-horizontal flex space-x-4">
                        <li>
                            <button
                                onClick={() => {
                                    handleMenuItemClick("TeamInbox"),
                                        navigate(
                                            "/dashboard/whatsapp/teamInbox"
                                        );
                                }}
                                className={`btn btn-ghost ${
                                    activeMenuItem === "TeamInbox"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="fas fa-inbox"></i> TeamInbox
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    handleMenuItemClick("Broadcast"),
                                        navigate(
                                            "/dashboard/whatsapp/broadcast"
                                        );
                                }}
                                className={`btn btn-ghost ${
                                    activeMenuItem === "Broadcast"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="fas fa-broadcast-tower"></i>{" "}
                                Broadcast
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    handleMenuItemClick("Chatbots"),
                                        navigate(
                                            "/dashboard/whatsapp/chatbots"
                                        );
                                }}
                                className={`btn btn-ghost ${
                                    activeMenuItem === "Chatbots"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="fas fa-robot"></i> Chatbots
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    handleMenuItemClick("crm"),
                                        navigate("/dashboard/whatsapp/crm");
                                }}
                                className={`btn btn-ghost ${
                                    activeMenuItem === "crm" ? "active" : ""
                                }`}
                            >
                                <img
                                    src="/assets/images/png/crm.png"
                                    alt="crm"
                                    width={24}
                                />{" "}
                                CRM
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    handleMenuItemClick("automations"),
                                        navigate(
                                            "/dashboard/whatsapp/automations"
                                        );
                                }}
                                className={`btn btn-ghost ${
                                    activeMenuItem === "Automations"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="fas fa-cogs"></i> Automations
                            </button>
                        </li>
                        <li className="dropdown dropdown-hover">
                            <button
                                tabIndex="0"
                                className="btn btn-ghost text-1xl"
                            >
                                More
                            </button>
                            <ul className="dropdown-content menu shadow-lg bg-white rounded-lg p-2 w-52">
                                <li>
                                    <button
                                        className="btn btn-ghost text-left w-full"
                                        onClick={() => {
                                            handleMenuItemClick("Contacts"),
                                                navigate(
                                                    "/dashboard/whatsapp/contacts"
                                                );
                                        }}
                                    >
                                        <i className="fas fa-address-book"></i>{" "}
                                        Contacts
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-ghost text-left w-full">
                                        <i className="fas fa-chart-bar"></i>{" "}
                                        Analytics
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-ghost text-left w-full">
                                        <i className="fas fa-code"></i> API docs
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-ghost text-left w-full">
                                        <i className="fas fa-users"></i> User
                                        Management
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-ghost text-left w-full">
                                        <i className="fas fa-plug"></i>{" "}
                                        Integration
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-ghost text-left w-full">
                                        <i className="fas fa-exchange-alt"></i>{" "}
                                        Web Hooks
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-ghost text-left w-full">
                                        <i className="fas fa-shopping-cart"></i>{" "}
                                        Commerce
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center">
                    <div className="dropdown dropdown-end notification-icon">
                        <button
                            tabIndex="0"
                            className="btn btn-ghost btn-circle text-1xl p-2"
                        >
                            <i className="fas fa-bell"></i>
                        </button>
                    </div>

                    <div
                        id="userIcon"
                        className="user-icon"
                        onClick={toggleSidebar}
                    >
                        <button
                            tabIndex="0"
                            className="btn btn-ghost btn-circle avatar text-1xl p-2"
                        >
                            <i className="fas fa-user"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-grow">
                <Outlet />
            </div>

            <div
                className={`sidebar ${
                    sidebarOpen ? "block" : "hidden"
                } absolute right-0 top-10 bg-slate-50 rounded-xl z-10`}
            >
                <button onClick={toggleSidebar}>
                    <img
                        src="/assets/images/svg/CrossIcon.svg"
                        width={16}
                        height={16}
                        alt="cross icon"
                        className="absolute top-5 right-5 cursor-pointer"
                    />
                </button>

                <div className="flex flex-col gap-5 justify-center items-center p-2">
                    <div className="rounded p-2 flex flex-col gap-4 sm:flex-row items-center justify-between bg-gray-100">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/images/svg/profile.svg"
                                width={24}
                                height={24}
                                alt="User Icon"
                            />
                            <div>
                                <h2 className="text-lg sm:text-xl">
                                    {user?.username}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            className="btn bg-red-500 text-white"
                            onClick={handleLogout}
                        >
                            Sign out
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="btn">Settings</button>
                        <button className="btn">Copy click-to-chat link</button>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row text-sm text-gray-600">
                        <span>
                            <i className="fas fa-info-circle"></i> Change Info
                        </span>
                        <span>
                            <i className="fas fa-bell"></i> Manage Notifications
                        </span>
                    </div>

                    <button className="btn block">Manage Accounts</button>
                </div>
            </div>
        </div>
    );
};

export default WhatsappNavbar;
