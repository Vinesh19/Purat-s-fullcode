import { useState, useEffect } from "react";
import {
    templateData,
    fetchTemplateMessage,
    submitBroadcastData,
} from "../../services/api";
import Mobile from "../../components/Mobile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewBroadcast = ({ closeModal, resetForm, user }) => {
    const [templates, setTemplates] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [message, setMessage] = useState("");
    const [attributes, setAttributes] = useState({});
    const [callToAction, setCallToAction] = useState({});
    const [quickReply, setQuickReply] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [csvData, setCsvData] = useState([]);
    const [csvRowCount, setCsvRowCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentCsvPage, setCurrentCsvPage] = useState(0);
    const [mediaContent, setMediaContent] = useState(null);
    const [contacts, setContacts] = useState("");
    const [preview, setPreview] = useState({});
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedMediaType, setSelectedMediaType] = useState("image");
    const [selectedButtonType, setSelectedButtonType] = useState("none");
    const [buttonData, setButtonData] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [headerMediaType, setHeaderMediaType] = useState([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await templateData();
                setTemplates(response?.data?.template || {});
            } catch (error) {
                toast.error("Failed to fetch templates");
                console.error("Failed to fetch templates", error);
            }
        };

        const currentDateTime = new Date();
        const formattedDate = currentDateTime.toISOString().split("T")[0];
        const formattedTime = currentDateTime
            .toTimeString()
            .split(" ")[0]
            .slice(0, 5);
        setSelectedDate(formattedDate);
        setSelectedTime(formattedTime);

        fetchTemplates();
    }, []);

    const handleTemplateChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedTemplate(selectedId); // Set the selected template ID
        try {
            const response = await fetchTemplateMessage(selectedId);
            const selectedTemplate = response?.data?.template;

            setMessage(selectedTemplate?.template_body || "");
            setHeaderMediaType(selectedTemplate?.header_media_type || []);

            setCallToAction({
                callPhoneNumber: selectedTemplate?.call_phone_btn_phone_number,
                callPhoneText: selectedTemplate?.call_phone_btn_text,
                visitWebsiteText: selectedTemplate?.visit_website_btn_text,
                visitWebsiteUrl: selectedTemplate?.visit_website_url_text,
            });

            setQuickReply({
                quickReply1: selectedTemplate?.quick_reply_btn_text1,
                quickReply2: selectedTemplate?.quick_reply_btn_text2,
                quickReply3: selectedTemplate?.quick_reply_btn_text3,
            });

            // Extract dynamic attributes from the message
            const matches =
                selectedTemplate?.template_body?.match(/{{\s*[\w]+\s*}}/g) ||
                [];
            const attrObj = {};
            matches.forEach((match, index) => {
                const key = match.replace(/[{}]/g, "").trim();
                attrObj[`attribute${index + 1}`] = key;
            });
            setAttributes(attrObj);
        } catch (error) {
            toast.error("Failed to fetch template message");
            console.error("Failed to fetch template message", error);
            setMessage("");
            setAttributes({});
        }
    };

    const handleAttributeChange = (key, value) => {
        setAttributes((prevAttrs) => ({
            ...prevAttrs,
            [key]: value,
        }));
    };

    const handleNextPage = () => setCurrentPage(2);
    const handlePreviousPage = () => setCurrentPage(1);

    const handleContactsChange = (e) => {
        setContacts(e.target.value);
        setCsvRowCount(e.target.value.split("\n").filter(Boolean).length);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "text/csv") {
            const reader = new FileReader();
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentLoaded = Math.round(
                        (event.loaded / event.total) * 100
                    );
                    setUploadProgress(percentLoaded);
                }
            };
            reader.onload = (event) => {
                const csvData = event.target.result;
                const rows = csvData.split("\n").map((row) => row.split(","));
                const rowCount = rows.length - 1; // Count rows, minus 1 for header row
                setCsvRowCount(rowCount);
                setCsvData(rows);
                setUploadProgress(100); // Set progress to 100% after load

                // Extract phone numbers from the CSV file and set the contacts state
                const phoneNumbers = rows.slice(1).map((row) => row[0]); // Assuming phone numbers are in the first column
                const combinedContacts = [
                    ...new Set([...contacts.split("\n"), ...phoneNumbers]),
                ].join("\n");
                setContacts(combinedContacts);
                setCsvRowCount(
                    combinedContacts.split("\n").filter(Boolean).length
                );
            };
            reader.readAsText(file);
        } else {
            toast.error("Please select a CSV file.");
            e.target.value = null; // Reset file input
        }
    };

    const handleNextCsvPage = () => {
        if ((currentCsvPage + 1) * 5 < csvData.length - 1) {
            setCurrentCsvPage(currentCsvPage + 1);
        }
    };

    const handlePreviousCsvPage = () => {
        if (currentCsvPage > 0) {
            setCurrentCsvPage(currentCsvPage - 1);
        }
    };

    const currentCsvData = csvData.slice(
        currentCsvPage * 5 + 1, // Skip the header row
        currentCsvPage * 5 + 6
    );

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaContent(file); // Set the file object directly
        }
    };

    const handleMediaTypeChange = (e) => {
        setSelectedMediaType(e.target.value);
        setMediaContent(null); // Clear the previous media content
    };

    const handleSubmitBroadcast = async () => {
        // Ensure that we have all the necessary data
        if (!selectedTemplate || !user.username || !message) {
            toast.error("Please ensure all fields are properly filled.");
            return;
        }

        const dataToSubmit = new FormData();
        dataToSubmit.append("template_name1", selectedTemplate);
        dataToSubmit.append("username", user.username);
        dataToSubmit.append("message", message);
        dataToSubmit.append("textbox", contacts);
        dataToSubmit.append("delivery_date", selectedDate);
        dataToSubmit.append("delivery_time", selectedTime);
        dataToSubmit.append("media_file", mediaContent);

        // Append dynamic attributes to FormData
        Object.keys(attributes).forEach((key) => {
            dataToSubmit.append(key, attributes[key]);
        });

        // Append button data to FormData
        if (selectedButtonType === "callToAction") {
            dataToSubmit.append(
                "call_to_action_text",
                buttonData.callPhoneText || ""
            );
            dataToSubmit.append(
                "call_to_action_phone",
                buttonData.callPhoneNumber || ""
            );
            dataToSubmit.append(
                "call_to_action_website_text",
                buttonData.visitWebsiteText || ""
            );
            dataToSubmit.append(
                "call_to_action_website_url",
                buttonData.visitWebsiteUrl || ""
            );
        } else if (selectedButtonType === "quickReply") {
            dataToSubmit.append(
                "quick_reply_text1",
                buttonData.quickReply1 || ""
            );
            dataToSubmit.append(
                "quick_reply_text2",
                buttonData.quickReply2 || ""
            );
            dataToSubmit.append(
                "quick_reply_text3",
                buttonData.quickReply3 || ""
            );
        }

        try {
            // Call the API to submit the data
            const response = await submitBroadcastData(dataToSubmit);
            console.log("Submission Successful:", response.data);
            toast.success("Broadcast submitted successfully!");
            // Reset form or handle next steps
            resetStates();
        } catch (error) {
            console.error("Failed to submit broadcast:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.errors
            ) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    errors[key].forEach((errorMsg) => {
                        toast.error(errorMsg);
                    });
                });
            } else {
                toast.error("Failed to submit broadcast. Please try again.");
            }
        }

        setPreview({
            template_name1: selectedTemplate,
            username: user.username,
            message: message,
            textbox: contacts,
            delivery_date: selectedDate,
            delivery_time: selectedTime,
            media_file: URL.createObjectURL(mediaContent),
            ...attributes,
            ...buttonData,
        });
    };

    const resetStates = () => {
        setTemplates({});
        setSelectedTemplate("");
        setMessage("");
        setAttributes({});
        setCallToAction({});
        setQuickReply({});
        setCurrentPage(1);
        setCsvData([]);
        setCsvRowCount(0);
        setUploadProgress(0);
        setCurrentCsvPage(0);
        setMediaContent(null);
        setContacts("");
        setSelectedDate("");
        setSelectedTime("");
        setSelectedMediaType("image");
        setSelectedButtonType("none");
        setButtonData({});
    };

    useEffect(() => {
        resetForm.current = resetStates;
    }, [resetForm]);

    const mediaTypeLabels = {
        image: "Image",
        video: "Video",
        document: "File",
    };

    return (
        <div className="flex h-[95vh] gap-[2%]">
            <ToastContainer />
            <div className="left-content grow xl:basis-[70%] pr-4 overflow-y-auto scrollbar-hide">
                {currentPage === 1 && (
                    <div>
                        <h2 className="text-lg font-bold border-b-2 pb-4">
                            New Broadcast
                        </h2>

                        <div className="flex gap-5 mt-5">
                            <label className="flex flex-col font-medium grow">
                                Broadcast Name
                                <input
                                    type="text"
                                    placeholder="Broadcast Name"
                                    className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal"
                                />
                            </label>

                            <label className="flex flex-col font-medium grow">
                                Broadcast Number
                                <input
                                    type="text"
                                    placeholder={user?.mobile_no}
                                    className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal cursor-not-allowed"
                                    disabled
                                />
                            </label>
                        </div>

                        <div>
                            <label className="mt-4 font-medium block">
                                Template
                            </label>

                            <select
                                className="w-[49%] border rounded-md px-2 py-1 mt-1 outline-none text-gray-400"
                                value={selectedTemplate} // Ensure the selected value is set
                                onChange={handleTemplateChange}
                            >
                                <option value="">Select Template</option>
                                {Object.entries(templates).map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>

                            <label className="flex flex-col mt-4 font-medium">
                                Message
                                <textarea
                                    className="rounded-md px-2 py-2 mt-1 border outline-none font-normal"
                                    rows="6"
                                    value={message}
                                    readOnly
                                ></textarea>
                            </label>
                        </div>

                        <h3 className="mt-4 font-medium">Call to Action</h3>
                        <div className="flex justify-center items-center gap-3">
                            {callToAction.callPhoneText && (
                                <button className="btn bg-blue-500 text-white mb-2 grow">
                                    {callToAction.callPhoneText}
                                </button>
                            )}

                            {callToAction.callPhoneNumber && (
                                <button className="btn bg-blue-500 text-white mb-2 grow">
                                    {callToAction.callPhoneNumber}
                                </button>
                            )}

                            {callToAction.visitWebsiteText && (
                                <button className="btn bg-blue-500 text-white mb-2 grow">
                                    {callToAction.visitWebsiteText}
                                </button>
                            )}

                            {callToAction.visitWebsiteUrl && (
                                <button className="btn bg-blue-500 text-white mb-2 grow">
                                    {callToAction.visitWebsiteUrl}
                                </button>
                            )}
                        </div>

                        {quickReply.quickReply1 && (
                            <div>
                                <h3 className="mt-4 font-medium">
                                    Quick Reply
                                </h3>
                                <div className="flex gap-3 mt-2">
                                    {quickReply.quickReply1 && (
                                        <button className="btn bg-green-500 text-white mb-2 grow">
                                            {quickReply.quickReply1}
                                        </button>
                                    )}
                                    {quickReply.quickReply2 && (
                                        <button className="btn bg-green-500 text-white mb-2 grow">
                                            {quickReply.quickReply2}
                                        </button>
                                    )}
                                    {quickReply.quickReply3 && (
                                        <button className="btn bg-green-500 text-white mb-2 grow">
                                            {quickReply.quickReply3}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <h2 className="font-semibold text-lg">
                                Attributes
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {Object.keys(attributes).map((key) => (
                                    <label
                                        key={key}
                                        className="flex flex-col font-medium"
                                    >
                                        {key}
                                        <input
                                            type="text"
                                            className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal"
                                            value={attributes[key]}
                                            onChange={(e) =>
                                                handleAttributeChange(
                                                    key,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="font-medium mt-4">
                            <h3>Scheduled Start Date</h3>

                            <div className="flex gap-5 mt-1">
                                <label className="flex flex-col grow">
                                    Date
                                    <input
                                        type="date"
                                        className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal text-gray-400"
                                        value={selectedDate}
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                    />
                                </label>

                                <label className="flex flex-col grow">
                                    Time
                                    <input
                                        type="time"
                                        className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal text-gray-400"
                                        value={selectedTime}
                                        onChange={(e) =>
                                            setSelectedTime(e.target.value)
                                        }
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            className="bg-blue-600 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-blue-500 mt-4"
                            onClick={handleNextPage}
                        >
                            Next
                        </button>
                    </div>
                )}

                {currentPage === 2 && (
                    <div>
                        <div className="flex gap-4">
                            <label className="flex flex-col mt-4 font-medium">
                                Contacts
                                <textarea
                                    className="rounded-md px-2 py-2 mt-1 border outline-none font-normal"
                                    rows="4"
                                    cols="24"
                                    value={contacts}
                                    onChange={handleContactsChange}
                                ></textarea>
                            </label>

                            <label className="flex flex-col font-medium mt-4">
                                Count
                                <input
                                    type="text"
                                    className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal cursor-not-allowed"
                                    value={csvRowCount}
                                    disabled
                                />
                                <div className="font-normal mt-2 flex">
                                    <div>
                                        <span className="font-medium">
                                            Import from CSV
                                        </span>{" "}
                                        <input
                                            type="file"
                                            name="csvFile"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                        />{" "}
                                    </div>
                                    <div>
                                        {uploadProgress > 0 && (
                                            <span
                                                className="radial-progress"
                                                style={{
                                                    "--value": uploadProgress,
                                                    "--size": "50px",
                                                    "--thickness": "4px",
                                                    height: "50px",
                                                    width: "50px",
                                                }}
                                                role="progressbar"
                                            >
                                                {uploadProgress}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={() => setShowGroupModal(true)}
                            className="btn btn-success my-5 text-gray-50"
                        >
                            Import Contacts From Group
                        </button>

                        <div>
                            <h3 className="font-semibold">Upload Media</h3>

                            <div className="flex gap-5">
                                {headerMediaType.includes("image") && (
                                    <label className="flex items-center gap-3 font-medium mt-4">
                                        <input
                                            type="radio"
                                            name="mediaType"
                                            value="image"
                                            checked={
                                                selectedMediaType === "image"
                                            }
                                            onChange={handleMediaTypeChange}
                                        />
                                        <span className="font-medium">
                                            Image
                                        </span>
                                    </label>
                                )}

                                {headerMediaType.includes("video") && (
                                    <label className="flex items-center gap-3 font-medium mt-4">
                                        <input
                                            type="radio"
                                            name="mediaType"
                                            value="video"
                                            checked={
                                                selectedMediaType === "video"
                                            }
                                            onChange={handleMediaTypeChange}
                                        />
                                        <span className="font-medium">
                                            Video
                                        </span>
                                    </label>
                                )}

                                {headerMediaType.includes("document") && (
                                    <label className="flex items-center gap-3 font-medium mt-4">
                                        <input
                                            type="radio"
                                            name="mediaType"
                                            value="file"
                                            checked={
                                                selectedMediaType === "file"
                                            }
                                            onChange={handleMediaTypeChange}
                                        />
                                        <span className="font-medium">
                                            File
                                        </span>
                                    </label>
                                )}

                                <input
                                    type="file"
                                    name="mediaFile"
                                    accept={
                                        selectedMediaType === "image"
                                            ? "image/*"
                                            : selectedMediaType === "video"
                                            ? "video/*"
                                            : "image/*,video/*,.pdf"
                                    }
                                    onChange={handleMediaUpload}
                                    className="mt-4"
                                />
                            </div>

                            <div>
                                {mediaContent && (
                                    <div className="mt-2">
                                        {selectedMediaType === "image" && (
                                            <img
                                                src={URL.createObjectURL(
                                                    mediaContent
                                                )}
                                                alt="Uploaded Media"
                                                className="mt-2 rounded"
                                                style={{
                                                    maxHeight: "150px",
                                                }}
                                            />
                                        )}
                                        {selectedMediaType === "video" && (
                                            <video
                                                controls
                                                src={URL.createObjectURL(
                                                    mediaContent
                                                )}
                                                className="mt-2 rounded"
                                                style={{
                                                    maxHeight: "150px",
                                                }}
                                            />
                                        )}
                                        {selectedMediaType === "file" && (
                                            <embed
                                                src={URL.createObjectURL(
                                                    mediaContent
                                                )}
                                                type="application/pdf"
                                                className="mt-2 rounded"
                                                style={{
                                                    maxHeight: "150px",
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="bg-gray-600 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-gray-500 mt-4"
                                onClick={handlePreviousPage}
                            >
                                Back
                            </button>

                            <button
                                className="bg-green-500 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-green-700 mt-4"
                                onClick={handleSubmitBroadcast}
                            >
                                Submit and run
                            </button>
                        </div>
                    </div>
                )}

                {showGroupModal && (
                    <div className=" fixed z-20 top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center bg-[#0000006a]">
                        <div className="mt-6 border p-5 bg-white relative">
                            <img
                                src="/assets/images/svg/CrossIcon.svg"
                                width={20}
                                height={20}
                                alt="cross icon"
                                className="absolute top-5 right-5 cursor-pointer"
                                onClick={() => setShowGroupModal(false)}
                            />

                            <h3 className="text-xl">
                                Import Contacts From Group
                            </h3>

                            <div className="flex gap-10 justify-between my-6">
                                <p>
                                    Show{" "}
                                    <select className="border px-2 mx-1">
                                        <option value="10">10</option>
                                    </select>{" "}
                                    entries
                                </p>
                                <p>
                                    Search{" "}
                                    <input type="text" className="border" />
                                </p>
                            </div>

                            <table className="w-full border-collapse border">
                                <thead>
                                    <tr>
                                        <th className="border p-2">S.No</th>
                                        <th className="border p-2">
                                            Group name
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.groups.map((group) => {
                                        const { id, group_name } = group;
                                        return (
                                            <tr key={id}>
                                                <td className="border p-2">
                                                    {id}
                                                </td>
                                                <td className="border p-2">
                                                    {group_name}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-gray-600 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-gray-500"
                                    onClick={handlePreviousCsvPage}
                                    disabled={currentCsvPage === 0}
                                >
                                    Previous
                                </button>

                                <button
                                    className="bg-gray-600 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-gray-500"
                                    onClick={handleNextCsvPage}
                                    disabled={
                                        (currentCsvPage + 1) * 5 >=
                                        csvData.length - 1
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden xl:basis-[28%] xl:flex flex-col items-center">
                <h2 className="font-medium text-center text-2xl mb-3">
                    Preview
                </h2>

                <div>
                    <Mobile data={preview} />
                </div>
            </div>
        </div>
    );
};

export default NewBroadcast;
