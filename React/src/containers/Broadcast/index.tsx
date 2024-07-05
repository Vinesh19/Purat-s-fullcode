import { useState, useRef } from "react";
import NewBroadcast from "../New-Broadcast";
import Modal from "../../components/Modal";

const Broadcast = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggleBroadcast, setToggleBroadcast] = useState(true);
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

    const handleBroadcastClick = () => {
        setToggleBroadcast(true);
    };

    return (
        <>
            {/* Main Content */}
            <div className="flex flex-grow">
                <div className="w-fit h-screen shadow-2xl">
                    <div className="bg-gray-100 h-screen flex">
                        <aside className="w-16 md:w-64 bg-transparent rounded-2xl px-4 py-8 border-r-2 shadow-inner">
                            <nav>
                                <ul className="flex flex-col gap-4">
                                    <li>
                                        <button
                                            onClick={() => handleBroadcastClick()}
                                            className="flex flex-col gap-2 md:flex-row items-baseline text-gray-700 font-bold p-2 rounded hover:bg-gray-100"
                                        >
                                            <i className="fas fa-history w-6 h-6 self-baseline"></i>
                                            <span className="hidden md:inline">
                                                Broadcast History
                                            </span>
                                        </button>
                                    </li>

                                    <li>
                                        <button className="flex flex-col gap-2 md:flex-row items-baseline text-gray-700 font-bold p-2 rounded hover:bg-gray-100">
                                            <i className="fas fa-calendar-alt w-6 h-6"></i>
                                            <span className="hidden md:inline">
                                                Scheduled Broadcasts
                                            </span>
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            className="flex flex-col gap-2 md:flex-row items-baseline text-gray-700 font-bold p-2 rounded hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                        >
                                            <i className="fas fa-envelope w-6 h-6"></i>
                                            <span className="hidden md:inline">
                                                Template Messages
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </aside>
                    </div>
                </div>

                <div className="flex-grow p-10 bg-gray-100">
                    {toggleBroadcast &&
                        (activeMenuItem === "Broadcast" ? (
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
                        ))}
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
        </>
    );
};

export default Broadcast;
