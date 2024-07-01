import { useState, useRef } from "react";
import NewBroadcast from "../New-Broadcast";
import Modal from "../../components/Modal";

const Broadcast = ({ user }) => {
    console.log(user, "Broad")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("Broadcast");

    const resetForm = useRef(null);

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        if (resetForm.current) resetForm.current(); // Reset form states
        setIsModalOpen(false);
    };

    const handleViewDataClick = () => {
        setActiveMenuItem("ViewData");
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">

            {/* Main Content */}
            <div className="flex flex-grow">
                <div className="w-fit h-screen shadow-2xl">
                    <div className="bg-gray-100 h-screen flex">
                        <aside className="w-16 md:w-64 bg-transparent shadow-2xl rounded-2xl mt-20 p-4">
                            <nav>
                                <ul>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            id="broadcast-history"
                                            className="flex flex-col md:flex-row items-center text-gray-700 font-bold p-2 rounded hover:bg-gray-100"
                                        >
                                            <i className="fas fa-history w-6 h-6"></i>
                                            <span className="hidden md:inline ml-2">
                                                Broadcast History
                                            </span>
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            id="scheduled-broadcasts"
                                            className="flex flex-col md:flex-row items-center text-gray-700 font-bold p-2 rounded hover:bg-gray-100"
                                        >
                                            <i className="fas fa-calendar-alt w-6 h-6"></i>
                                            <span className="hidden md:inline ml-2">
                                                Scheduled Broadcasts
                                            </span>
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a
                                            href="#"
                                            id="template-messages"
                                            className="flex flex-col md:flex-row items-center text-gray-700 font-bold p-2 rounded hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                        >
                                            <i className="fas fa-envelope w-6 h-6"></i>
                                            <span className="hidden md:inline ml-2">
                                                Template Messages
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </aside>
                    </div>
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
                                        src="/assets/images/png/WhatsApp-img.jpg"
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
                                        src="/assets/images/png/WhatsApp-img.jpg"
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

export default Broadcast;
