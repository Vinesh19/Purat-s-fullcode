import React, { memo } from "react";

const Modal = ({
    isModalOpen,
    closeModal,
    children,
    width = "75vw",
    height = "95vh",
}) => {
    return isModalOpen ? (
        <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-55 flex items-center justify-center">
            <div
                className="bg-white overflow-auto fixed px-6 py-4 scrollbar-hide"
                style={{ width, height }}
            >
                <div>
                    <img
                        src="/assets/images/svg/CrossIcon.svg"
                        width={20}
                        height={20}
                        alt="cross icon"
                        className="absolute top-5 right-5 cursor-pointer"
                        onClick={closeModal}
                    />
                </div>

                {children}
            </div>
        </div>
    ) : null;
};

export default memo(Modal);
