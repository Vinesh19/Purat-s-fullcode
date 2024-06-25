import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NewBroadcast from "../containers/New-Broadcast";
import Modal from "../components/Modal";
import { logout } from "../services/api";

const Dashboard = ({ user, setUser }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("Broadcast");

    const resetForm = useRef(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleHamburgerMenu = () => {
        setHamburgerMenuOpen(!hamburgerMenuOpen);
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        if (resetForm.current) resetForm.current(); // Reset form states
        setIsModalOpen(false);
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

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    const handleViewDataClick = () => {
        setActiveMenuItem("ViewData");
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex justify-between shadow-md">
                <div className="flex items-center mx-4 my-1">
                    <div className="lg:hidden" onClick={toggleHamburgerMenu}>
                        <i className="fas fa-bars"></i>
                    </div>

                    <button
                        className="btn btn-ghost text-4xl"
                        onClick={() => handleMenuItemClick("PuRat")}
                    >
                        PuRat
                    </button>
                </div>

                <div className="hidden lg:flex items-center">
                    <ul className="menu menu-horizontal flex space-x-4">
                        <li>
                            <button
                                onClick={() => handleMenuItemClick("TeamInbox")}
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
                                onClick={() => handleMenuItemClick("Broadcast")}
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
                                onClick={() => handleMenuItemClick("Chatbots")}
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
                                onClick={() => handleMenuItemClick("Contacts")}
                                className={`btn btn-ghost ${
                                    activeMenuItem === "Contacts"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <i className="fas fa-address-book"></i> Contacts
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() =>
                                    handleMenuItemClick("Automations")
                                }
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

            {/* Main Content */}
            <div className="flex flex-grow">
                <div
                    className={`lg:hidden ${
                        hamburgerMenuOpen ? "block" : "hidden"
                    } w-fit h-screen shadow-2xl`}
                >
                    <ul className="menu menu-vertical p-4">
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("TeamInbox")}
                            >
                                <i className="fas fa-inbox"></i> TeamInbox
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("Broadcast")}
                            >
                                <i className="fas fa-broadcast-tower"></i>{" "}
                                Broadcast
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("Chatbots")}
                            >
                                <i className="fas fa-robot"></i> Chatbots
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("Contacts")}
                            >
                                <i className="fas fa-address-book"></i> Contacts
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() =>
                                    handleMenuItemClick("Automations")
                                }
                            >
                                <i className="fas fa-cogs"></i> Automations
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("Analytics")}
                            >
                                <i className="fas fa-chart-bar"></i> Analytics
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("API docs")}
                            >
                                <i className="fas fa-code"></i> API docs
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() =>
                                    handleMenuItemClick("User Management")
                                }
                            >
                                <i className="fas fa-users"></i> User Management
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() =>
                                    handleMenuItemClick("Integration")
                                }
                            >
                                <i className="fas fa-plug"></i> Integration
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("Web Hooks")}
                            >
                                <i className="fas fa-exchange-alt"></i> Web
                                Hooks
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-ghost text-left w-full"
                                onClick={() => handleMenuItemClick("Commerce")}
                            >
                                <i className="fas fa-shopping-cart"></i>{" "}
                                Commerce
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="flex-grow p-10 bg-gray-100">
                    {activeMenuItem === "Broadcast" ? (
                        <>
                            <div className="bg-white p-5 shadow-md mb-5">
                                <h1 className="text-lg md:text-2xl font-medium">
                                    Manage Broadcast Services
                                </h1>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="bg-teal-600 p-5 rounded-lg flex flex-col items-center gap-3 w-64 h-56 lg:w-72 lg:h-60">
                                    <img
                                        src="/src/assets/images/png/WhatsApp-img.jpg"
                                        alt="WhatsApp Official"
                                        className="w-24 h-24 rounded-3xl"
                                    />
                                    <p className="text-white text-lg">
                                        WhatsApp Official
                                    </p>
                                    <button
                                        className="bg-white text-black py-2 px-4 rounded cursor-pointer font-medium"
                                        onClick={handleViewDataClick}
                                    >
                                        View Data →
                                    </button>
                                </div>
                                <div className="bg-teal-600 p-5 rounded-lg flex flex-col items-center gap-3 w-64 h-56 lg:w-72 lg:h-60">
                                    <img
                                        src="/src/assets/images/png/WhatsApp-img.jpg"
                                        alt="GSM SMS"
                                        className="w-24 h-24 rounded-3xl"
                                    />
                                    <p className="text-white text-lg">
                                        GSM SMS
                                    </p>
                                    <button
                                        className="bg-white text-black py-2 px-4 rounded cursor-pointer font-medium"
                                        onClick={handleViewDataClick}
                                    >
                                        View Data →
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {activeMenuItem === "ViewData" && (
                                <button
                                    className="absolute right-5 btn bg-blue-500 text-white"
                                    onClick={handleModal}
                                >
                                    New Broadcast
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div
                className={`sidebar ${
                    sidebarOpen ? "block" : "hidden"
                } absolute right-0 top-10 bg-slate-50 rounded-xl z-10`}
            >
                <button onClick={toggleSidebar}>
                    <img
                        src="src/assets/images/svg/CrossIcon.svg"
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
                                src="src/assets/images/svg/profile.svg"
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

            {isModalOpen && (
                <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
                    <NewBroadcast
                        closeModal={closeModal}
                        resetForm={resetForm}
                        user={user}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
