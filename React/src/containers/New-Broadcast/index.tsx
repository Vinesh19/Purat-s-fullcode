import { useState, useEffect } from "react";
import { templateData } from "../../services/api";
import Mobile from "../../components/Mobile";

const API = templateData;

const NewBroadcast = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [message, setMessage] = useState("");
    const [attributes, setAttributes] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [csvData, setCsvData] = useState([]);
    const [csvRowCount, setCsvRowCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentCsvPage, setCurrentCsvPage] = useState(0);
    const [mediaContent, setMediaContent] = useState(null);

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setCurrentPage(1); // Reset to first page when closing the modal
    //     setCsvRowCount(0); // Reset CSV row count when closing the modal
    //     setUploadProgress(0); // Reset upload progress when closing the modal
    //     setCurrentCsvPage(0); // Reset CSV pagination
    //     setCsvData([]); // Reset CSV data
    //     setMediaContent(null); // Reset media content
    //     setAttributes({}); // Reset attributes
    // };

    // Use the local template data directly
    useEffect(() => {
        setTemplates(API);
    }, []);

    const handleTemplateChange = (e) => {
        const selectedId = e.target.value;
        const selectedTemplate = templates.find(
            (template) => template.id === parseInt(selectedId)
        );
        if (selectedTemplate) {
            setSelectedTemplate(selectedTemplate.name);
            setMessage(selectedTemplate.message);
            // Extract dynamic attributes from the message
            const matches = selectedTemplate.message.match(/{{\s*[\w]+\s*}}/g);
            const attrObj = {};
            matches.forEach((match, index) => {
                const key = match.replace(/[{}]/g, "").trim();
                attrObj[`attribute${index + 1}`] = key;
            });
            setAttributes(attrObj);
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
            };
            reader.readAsText(file);
        } else {
            alert("Please select a CSV file.");
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
            const reader = new FileReader();
            reader.onload = (event) => {
                setMediaContent(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex h-[95vh]">
            <div className="left-content basis-[70%] overflow-y-auto pr-4">
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
                                    placeholder="Broadcast Number"
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
                                value={selectedTemplate}
                                onChange={handleTemplateChange}
                            >
                                <option>Select Template</option>
                                {templates.map((template) => (
                                    <option
                                        key={template.id}
                                        value={template.id}
                                    >
                                        {template.name}
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
                                    />
                                </label>

                                <label className="flex flex-col grow">
                                    Time
                                    <input
                                        type="time"
                                        className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal text-gray-400"
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
                                Message
                                <textarea
                                    className="rounded-md px-2 py-2 mt-1 border outline-none font-normal"
                                    rows="4"
                                    cols="20"
                                    value={message}
                                    readOnly
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
                                <p className="font-normal mt-2">
                                    <span className="font-medium">
                                        Import from CSV
                                    </span>{" "}
                                    <input
                                        type="file"
                                        name="csvFile"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                    />{" "}
                                    {uploadProgress > 0 && (
                                        <div
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
                                        </div>
                                    )}
                                </p>
                            </label>
                        </div>

                        <div className="mt-6 border p-5">
                            <h3 className="text-xl">
                                Import from contact groups
                            </h3>

                            <div className="flex justify-between mt-2">
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

                            <table className="w-full border-collapse border mt-4">
                                <thead>
                                    <tr>
                                        <th className="border p-2">S.No</th>
                                        <th className="border p-2">
                                            Group name
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCsvData.map((row, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">
                                                {currentCsvPage * 5 + index + 1}
                                            </td>
                                            <td className="border p-2">
                                                {row.join(", ")}
                                            </td>
                                        </tr>
                                    ))}
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

                        <div>
                            <h3 className="font-semibold">Upload Media</h3>

                            <div className="flex gap-8">
                                <div className="flex flex-col">
                                    <label className="flex items-center gap-3 font-medium mt-4">
                                        <span className="font-medium">
                                            Image
                                        </span>
                                        <input
                                            type="file"
                                            name="mediaFile"
                                            accept="image/*"
                                            onChange={handleMediaUpload}
                                        />
                                    </label>

                                    <label className="flex items-center gap-4 font-medium mt-4">
                                        <span className="font-medium">
                                            Video
                                        </span>
                                        <input
                                            type="file"
                                            name="mediaFile"
                                            accept="video/*"
                                            onChange={handleMediaUpload}
                                        />
                                    </label>

                                    <label className="flex items-center gap-8 font-medium mt-4">
                                        <span className="font-medium">
                                            File
                                        </span>
                                        <input
                                            type="file"
                                            name="mediaFile"
                                            accept="image/*,video/*,.pdf"
                                            onChange={handleMediaUpload}
                                        />
                                    </label>
                                </div>

                                <div>
                                    {mediaContent && (
                                        <div className="mt-2">
                                            {mediaContent.startsWith(
                                                "data:image/"
                                            ) ? (
                                                <img
                                                    src={mediaContent}
                                                    alt="Uploaded Media"
                                                    className="mt-2 rounded"
                                                    style={{
                                                        maxHeight: "150px",
                                                    }}
                                                />
                                            ) : mediaContent.startsWith(
                                                  "data:video/"
                                              ) ? (
                                                <video
                                                    controls
                                                    src={mediaContent}
                                                    className="mt-2 rounded"
                                                    style={{
                                                        maxHeight: "150px",
                                                    }}
                                                />
                                            ) : (
                                                <embed
                                                    src={mediaContent}
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
                        </div>

                        <button
                            className="bg-gray-600 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-gray-500 mt-4"
                            onClick={handlePreviousPage}
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>

            <div className="basis-[30%] flex flex-col items-center">
                <h2 className="font-medium text-center text-2xl">Preview</h2>

                <div>
                    <Mobile />
                </div>
            </div>
        </div>
    );
};

export default NewBroadcast;
