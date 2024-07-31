import { useState, useRef } from "react";
import Button from "../../Button";

const FileUploadModal = ({ setSelectedMedia, closeModal }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const fileInputRef = useRef(null);

    const options = [
        {
            id: 1,
            name: "Images",
            icon: "/assets/images/svg/images.svg",
            accept: ".jpeg,.jpg,.png",
        },
        {
            id: 2,
            name: "Videos",
            icon: "/assets/images/svg/videos.svg",
            accept: "video/*",
        },
        {
            id: 3,
            name: "Documents",
            icon: "/assets/images/svg/documents.svg",
            accept: ".pdf,.doc,.docx",
        },
        {
            id: 4,
            name: "Audios",
            icon: "/assets/images/svg/audios.svg",
            accept: "audio/*",
        },
        {
            id: 5,
            name: "Stickers",
            icon: "/assets/images/svg/stickers.svg",
            accept: ".png,.gif,.jpg,.jpeg",
        },
    ];

    const handleOptionClick = (id) => {
        setSelectedOption(id);
    };

    const getAcceptType = () => {
        const selected = options.find((option) => option.id === selectedOption);
        return selected ? selected.accept : "*/*";
    };

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedMedia(file);
            closeModal(); 
        }
    };

    return (
        <div className="flex gap-6 my-8">
            <div className="w-1/4 bg-white">
                <ul className="space-y-4">
                    {options.map((option) => (
                        <li
                            key={option.id}
                            className={`flex items-end gap-1 hover:bg-slate-50 p-1 cursor-pointer ${
                                selectedOption === option.id
                                    ? "bg-slate-200"
                                    : ""
                            }`}
                            onClick={() => handleOptionClick(option.id)}
                        >
                            <img src={option.icon} alt={option.name} />
                            {option.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-3/4">
                <div className="flex flex-col justify-center items-center border-dashed border-2 border-gray-400 p-6 rounded-lg">
                    <img
                        src="/assets/images/svg/upload.svg"
                        alt="upload image"
                        className="w-20"
                    />
                    <p className="mb-4">Drag & Drop Files Here</p>
                    <p className="text-sm text-gray-500 mb-4">
                        (Supported file types are jpeg and png).
                    </p>

                    <input
                        type="file"
                        accept={getAcceptType()}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button variant="primary" onClick={handleBrowseClick}>
                        Browse Files
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
