import { useState } from "react";
import Input from "../../Input";
import Modal from "../../Modal";
import CustomParameter from "./CustomParameter";

const UserInfo = () => {
    // State to manage the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to manage custom parameters
    const [customParameters, setCustomParameters] = useState([
        { key: "Language", value: "en" },
        { key: "Name", value: "Yash Sharma" },
    ]);

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveAttributes = (attributes) => {
        // Update the custom parameters state with the new attributes
        setCustomParameters(attributes);
        closeModal();
    };

    return (
        <div className="w-[22vw] px-4 py-4">
            <div className="flex justify-between items-center border-b pb-5">
                <div className="flex gap-4 items-center">
                    <div className="relative -z-10 z">
                        <span className="text-green-600 text-2xl font-bold bg-slate-100 px-5 py-3 rounded-full">
                            V
                        </span>
                        <span className="absolute right-1 bottom-8 text-8xl leading-3 w-3 h-3 text-green-500">
                            .
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-xl">Bot</span>
                        <span>Available</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <img
                        src="/assets/images/svg/whatsapp.svg"
                        alt="WhatsApp Icon"
                        className="w-10 h-10 outline outline-1 outline-slate-400 rounded-lg p-2"
                    />
                    <img
                        src="/assets/images/svg/chat.svg"
                        alt="SMS Icon"
                        className="w-10 h-10 outline outline-1 outline-slate-400 rounded-lg p-2"
                    />
                </div>
            </div>

            <div className="scrollbar-hide h-[80vh] overflow-y-auto">
                <div className="my-6">
                    <h3 className="font-semibold text-lg">Basic Information</h3>
                    <p className="flex items-center gap-2">
                        Phone number : 918878695196{" "}
                        <span>
                            <img
                                src="/assets/images/svg/Indian-flag.svg"
                                alt="India's flag"
                                className="w-6"
                            />
                        </span>
                    </p>
                </div>

                <div className="border-y py-4 my-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Contact custom parameters</h4>
                        <img
                            src="/assets/images/svg/pen.svg"
                            alt="pen"
                            onClick={handleModal}
                            className="bg-green-600 p-1 w-8 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div className="my-6">
                        <table className="min-w-full border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-r">
                                        Parameter
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customParameters.map((param, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b border-r">
                                            {param.key}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {param.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border-b pb-8">
                    <h4 className="font-bold">Tags</h4>
                    <div className="relative mt-2">
                        <img
                            src="/assets/images/svg/tag.svg"
                            alt="tag"
                            className="absolute left-2 top-4"
                        />
                        <Input className="w-full" />
                    </div>
                </div>

                <div className="my-4">
                    <div className="flex justify-between items-center my-4">
                        <h4 className="font-bold">Notes</h4>
                        <h4 className="bg-green-600 w-8 h-8 text-2xl text-white font-semibold flex justify-center items-center rounded-md">
                            +
                        </h4>
                    </div>
                    <p>
                        Notes help you to keep track of your conversation with
                        your team
                    </p>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    width="40vw"
                    height="60vh"
                    className="rounded-lg shadow-2xl"
                >
                    <CustomParameter
                        onSave={handleSaveAttributes}
                        params={customParameters}
                    />
                </Modal>
            )}
        </div>
    );
};

export default UserInfo;
