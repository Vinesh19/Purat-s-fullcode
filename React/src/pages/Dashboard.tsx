import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NewBroadcast from "../containers/New-Broadcast";
import Modal from "../components/Modal";

const Dashboard = ({ user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("");

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/"); // Redirect to the index page
    };

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    return (
        <div>
            {/* Main Content */}
            <div className=" h-screen overflow-hidden">
                <div className="flex justify-between shadow-md">
                    <div className="flex items-center">
                        <div
                            className="lg:hidden"
                            onClick={toggleHamburgerMenu}
                        >
                            <i className="fas fa-bars"></i>
                        </div>

                        <a href="#" className="btn btn-ghost text-4xl">
                            PuRat
                        </a>
                    </div>

                    <div className="hidden lg:flex items-center">
                        <ul className="menu menu-horizontal flex space-x-4">
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleMenuItemClick("TeamInbox")
                                    }
                                    className={
                                        activeMenuItem === "TeamInbox"
                                            ? "active"
                                            : ""
                                    }
                                >
                                    <i className="fas fa-inbox"></i> TeamInbox
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleMenuItemClick("Broadcast")
                                    }
                                    className={
                                        activeMenuItem === "Broadcast"
                                            ? "active"
                                            : ""
                                    }
                                >
                                    <i className="fas fa-broadcast-tower"></i>{" "}
                                    Broadcast
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleMenuItemClick("Chatbots")
                                    }
                                    className={
                                        activeMenuItem === "Chatbots"
                                            ? "active"
                                            : ""
                                    }
                                >
                                    <i className="fas fa-robot"></i> Chatbots
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleMenuItemClick("Contacts")
                                    }
                                    className={
                                        activeMenuItem === "Contacts"
                                            ? "active"
                                            : ""
                                    }
                                >
                                    <i className="fas fa-address-book"></i>{" "}
                                    Contacts
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleMenuItemClick("Automations")
                                    }
                                    className={
                                        activeMenuItem === "Automations"
                                            ? "active"
                                            : ""
                                    }
                                >
                                    <i className="fas fa-cogs"></i> Automations
                                </a>
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
                                        <a href="#">
                                            <i className="fas fa-chart-bar"></i>{" "}
                                            Analytics
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-code"></i> API
                                            docs
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-users"></i>{" "}
                                            User Management
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-plug"></i>{" "}
                                            Integration
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-exchange-alt"></i>{" "}
                                            Web Hooks
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fas fa-shopping-cart"></i>{" "}
                                            Commerce
                                        </a>
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

                {/* Hamburger Menu for Mobile */}
                <div
                    id="hamburgerMenu"
                    className={`hamburger-menu ${
                        hamburgerMenuOpen ? "block" : "hidden"
                    } w-max h-screen shadow-2xl`}
                >
                    <ul className=" lg:hidden menu menu-vertical p-4">
                        <li>
                            <a href="#">
                                <i className="fas fa-inbox"></i> TeamInbox
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-broadcast-tower"></i>{" "}
                                Broadcast
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-robot"></i> Chatbots
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-address-book"></i> Contacts
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-cogs"></i> Automations
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-chart-bar"></i> Analytics
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-code"></i> API docs
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-users"></i> User Management
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-plug"></i> Integration
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-exchange-alt"></i> Web
                                Hooks
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-shopping-cart"></i>{" "}
                                Commerce
                            </a>
                        </li>
                    </ul>
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

            <div className="absolute right-5 top-20">
                {activeMenuItem === "Broadcast" && (
                    <div>
                        <button
                            className="btn bg-blue-500 text-white"
                            onClick={handleModal}
                        >
                            New Broadcast
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
                    <NewBroadcast
                        closeModal={closeModal}
                        resetForm={resetForm}
                        broadcastNumber={user.mobile_no}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
