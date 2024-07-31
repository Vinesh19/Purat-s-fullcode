import { useState, useEffect, useRef } from "react";
import Button from "../../Button";

const CreateQuickReply = ({ onSave, initialData }) => {
    const [heading, setHeading] = useState(
        initialData ? initialData.heading : ""
    );
    const [description, setDescription] = useState(
        initialData ? initialData.description : ""
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [media, setMedia] = useState(null);
    const fileInputRef = useRef(null);

    const handleSave = () => {
        if (!heading.trim()) {
            setErrorMessage("Heading is required");
            return;
        }
        setErrorMessage("");
        onSave({ heading, description, media });
    };

    const handleMediaChange = (e) => {
        const selectedMedia = e.target.files[0];
        setMedia(selectedMedia);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const renderMediaPreview = () => {
        if (!media) return null;
        const mediaURL = URL.createObjectURL(media);
        const mediaType = media.type.split("/")[0];

        switch (mediaType) {
            case "image":
                return <img src={mediaURL} alt="Selected Media" />;
            case "video":
                return <video controls src={mediaURL} />;
            case "audio":
                return <audio controls src={mediaURL} />;
            case "application":
                if (media.type === "application/pdf") {
                    return <embed src={mediaURL} type="application/pdf" />;
                }
                break;
            default:
                return (
                    <p className="mx-auto my-4">
                        Cannot preview this file type
                    </p>
                );
        }
    };

    useEffect(() => {
        if (initialData) {
            setHeading(initialData.heading);
            setDescription(initialData.description);
        }
    }, [initialData]);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold pb-4 border-b">
                {initialData
                    ? "Edit Quick Response"
                    : "Create a New Quick Response"}
            </h2>

            <div className="overflow-auto scrollbar-hide">
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Name the Quick Response
                    </label>
                    <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        className="w-full p-2 bg-slate-50 rounded outline-none"
                        placeholder="Enter the title"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Enter your Quick Response
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 bg-slate-50 rounded outline-none"
                        rows="4"
                        placeholder="Enter your quick reply message"
                    />
                </div>

                <div className="mb-4">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="flex gap-3 items-center bg-slate-50 p-2 rounded border border-dashed border-green-500 text-green-500"
                    >
                        <img
                            src="/assets/images/svg/upload-new.svg"
                            alt="upload"
                        />
                        Upload media
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleMediaChange}
                        className="hidden"
                    />
                    {media && (
                        <div className="mt-10 m-auto w-52 shadow-2xl">
                            {renderMediaPreview()}
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <div className="flex justify-end">
                    <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuickReply;
