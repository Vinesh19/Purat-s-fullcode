import React, { useState, useEffect } from "react";
import {
  templateData,
  templateGroups,
  submitBroadcastData,
} from "../../services/api";
import Mobile from "../../components/Mobile";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import Loader from "../../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewBroadcast = ({ closeModal, resetForm, user }) => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [footer, setFooter] = useState("");
  const [attributes, setAttributes] = useState({});
  const [callToAction, setCallToAction] = useState({});
  const [quickReply, setQuickReply] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [csvData, setCsvData] = useState([]);
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentCsvPage, setCurrentCsvPage] = useState(0);
  const [contacts, setContacts] = useState("");
  const [preview, setPreview] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedButtonType, setSelectedButtonType] = useState("none");
  const [buttonData, setButtonData] = useState({});
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [headerMediaType, setHeaderMediaType] = useState(null);
  const [mediaContent, setMediaContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [broadcastName, setBroadcastName] = useState("");
  const [carousels, setCarousels] = useState([]); // New state for carousels
  const [mediaCarouselsContent, setMediaCarouselsContent] = useState(null); // For carousels media contain

  // Fetch template groups based on the user's username
  const fetchTemplateGroups = async () => {
    try {
      const response = await templateGroups({
        username: user.username,
      });
      setGroups(response?.data);
    } catch (error) {
      toast.error("Failed to fetch group data");
      console.error("Failed to fetch groups", error);
    }
  };

  // Handle the change of the selected template
  const handleTemplateChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedTemplate(selectedId); // Set the selected template ID

    try {
      const response = await templateData({
        username: user.username,
        action: "read",
        id: selectedId,
      });
      const selectedTemplate = response?.data?.template?.find(
        (t) => t.id == selectedId
      );

      setMessage(selectedTemplate?.template_body || "");
      setHeaderMediaType(selectedTemplate?.header_media_type || null); // Set header media type
      setFooter(selectedTemplate?.template_footer || "");
      setCallToAction({
        callPhoneNumber: selectedTemplate?.call_phone_btn_phone_number,
        callPhoneText: selectedTemplate?.call_phone_btn_text,
        visitWebsiteText: selectedTemplate?.visit_website_btn_text,
        visitWebsiteUrl: selectedTemplate?.visit_website_url_text,
      });

      setQuickReply(selectedTemplate?.quick_replies || []);

      // Extract dynamic attributes from the message
      const matches =
        selectedTemplate?.template_body?.match(/{{\s*[\w]+\s*}}/g) || [];
      const attrObj = {};
      matches.forEach((match, index) => {
        const key = match.replace(/[{}]/g, "").trim();
        attrObj[`attribute${index + 1}`] = key;
      });
      setAttributes(attrObj);

      // Set carousels if available
      setCarousels(selectedTemplate?.carousels || []);
    } catch (error) {
      toast.error("Failed to fetch template message");
      console.error("Failed to fetch template message", error);
      setMessage("");
      setAttributes({});
      setQuickReply([]);
      setCarousels([]); // Reset carousels on error
    }
  };

  // Handle change in attributes
  const handleAttributeChange = (key, value) => {
    setAttributes((prevAttrs) => ({
      ...prevAttrs,
      [key]: value,
    }));
  };

  const handleNextPage = () => setCurrentPage(2);
  const handlePreviousPage = () => setCurrentPage(1);

  const renderCallToActionSection = () => {
    if (
      callToAction.callPhoneText ||
      callToAction.callPhoneNumber ||
      callToAction.visitWebsiteText ||
      callToAction.visitWebsiteUrl ||
      quickReply.length > 0
    ) {
      return (
        <>
          <h3 className="my-4 font-medium">Call to Action & Quick Replies</h3>
          <div>
            <div className="flex justify-center items-center flex-wrap gap-3">
              {callToAction.callPhoneText && callToAction.callPhoneNumber && (
                <button
                  className="btn bg-blue-500 text-white mb-2 grow"
                  onClick={() =>
                    (window.location.href = `tel:${callToAction.callPhoneNumber}`)
                  }
                >
                  {callToAction.callPhoneText}
                </button>
              )}

              {callToAction.visitWebsiteText &&
                callToAction.visitWebsiteUrl && (
                  <button
                    className="btn bg-blue-500 text-white mb-2 grow"
                    onClick={() =>
                      window.open(callToAction.visitWebsiteUrl, "_blank")
                    }
                  >
                    {callToAction.visitWebsiteText}
                  </button>
                )}
            </div>

            <div className="flex justify-center items-center flex-wrap gap-3">
              {quickReply.map((reply, index) => (
                <button
                  key={index}
                  className="btn bg-green-500 text-white grow"
                  onClick={() => handleQuickReplyClick(reply)}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  // Handle quick reply clicks
  const handleQuickReplyClick = (reply) => {
    switch (reply.type) {
      case "PHONE_NUMBER":
        window.location.href = `tel:${reply.phone_number}`;
        break;
      case "URL":
        window.open(reply.url, "_blank");
        break;
      default:
        console.log("Quick reply clicked:", reply.text);
    }
  };

  // Handle changes in contact input
  const handleContactsChange = (e) => {
    setContacts(e.target.value);
    setCsvRowCount(e.target.value.split("\n").filter(Boolean).length);
  };

  // Handle file upload for CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 100);
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
        setCsvRowCount(combinedContacts.split("\n").filter(Boolean).length);
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

  // Handle file upload for media content
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file); // Add logging for debugging
      setMediaContent(file); // Set the file object directly
    }
  };

  // Function to handle file upload for carousels media content
  const handleCarouselsMediaUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setCarousels((prevCarousels) => {
        const newCarousels = [...prevCarousels];
        newCarousels[index].mediaContent = file; // Store the file in the carousel's media content
        return newCarousels;
      });
    }
  };

  const handleImportFromFileManager = async () => {
    try {
      const response = await axios.get("/api/getImagePath"); // Replace with your API endpoint
      const imagePath = response.data.path;
      const mediaBlob = await fetch(imagePath).then((res) => res.blob());
      setMediaContent(mediaBlob);
    } catch (error) {
      console.error("Error fetching image path: ", error);
    }
  };

  // Handle submission of broadcast
  const handleSubmitBroadcast = async () => {
    // Ensure that we have all the necessary data
    if (!selectedTemplate || !user.username || !message) {
      toast.error("Please ensure all fields are properly filled.");
      return;
    }

    setIsSubmitting(true);

    const dataToSubmit = new FormData();

    const templateId = selectedTemplate;
    const templateName = templates[templateId];

    dataToSubmit.append("template_name", templateName);
    dataToSubmit.append("username", user.username);
    dataToSubmit.append("message", message);
    dataToSubmit.append("textbox", contacts);
    dataToSubmit.append("scheduled_date", selectedDate);
    dataToSubmit.append("scheduled_time", selectedTime);
    dataToSubmit.append("media_file", mediaContent);
    dataToSubmit.append("template_id2", selectedTemplate);
    dataToSubmit.append("broadcast_name", broadcastName);

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
      dataToSubmit.append("quick_reply_text1", buttonData.quickReply1 || "");
      dataToSubmit.append("quick_reply_text2", buttonData.quickReply2 || "");
      dataToSubmit.append("quick_reply_text3", buttonData.quickReply3 || "");
    }
    // **Append carousel media paths to FormData**
    carousels.forEach((carousel, index) => {
      if (carousel.mediaContent) {
        dataToSubmit.append(
          `carousel_media_${index + 1}`,
          carousel.mediaContent
        ); // Append each media content
      }
    });

    try {
      // Call the API to submit the data
      const response = await submitBroadcastData(dataToSubmit);
      toast.success("Broadcast submitted successfully!");
      // Reset form or handle next steps
      resetStates();
      closeModal();
    } catch (error) {
      console.error("Failed to submit broadcast:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          errors[key].forEach((errorMsg) => {
            toast.error(errorMsg);
          });
        });
      } else {
        toast.error("Failed to submit broadcast. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStates = () => {
    setTemplates({});
    setSelectedTemplate("");
    setMessage("");
    setFooter("");
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
    setSelectedButtonType("none");
    setButtonData({});
    setCarousels([]); // Reset carousels
  };

  useEffect(() => {
    if (!user || !user.username) {
      // If user is not available, no need to fetch templates
      return;
    }

    const fetchTemplatesAndMessages = async () => {
      try {
        const response = await templateData({
          username: user.username,
          action: "read",
        });

        if (response?.data?.template) {
          const templateList = response.data.template;
          const templateMap = templateList.reduce((acc, template) => {
            acc[template.id] = template.template_name;
            return acc;
          }, {});
          setTemplates(templateMap);
        } else {
          toast.error("No templates found");
        }
      } catch (error) {
        toast.error("Failed to fetch templates");
        console.error("Failed to fetch templates", error);
      }
    };

    // Set date and time
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split("T")[0];
    const formattedTime = currentDateTime
      .toTimeString()
      .split(" ")[0]
      .slice(0, 5);

    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);

    // Fetch templates and messages
    fetchTemplatesAndMessages();
  }, [user]); // Add `user` to the dependencies array

  useEffect(() => {
    const previewData = {
      message,
      scheduled_date: selectedDate,
      scheduled_time: selectedTime,
      media_file: mediaContent ? URL.createObjectURL(mediaContent) : null,
      media_type: mediaContent ? mediaContent.type : null, // Include media type
      action: callToAction,
      reply: quickReply,
      carousels, // Include carousels in preview
      carousels: carousels.map((carousel) => ({
        ...carousel,
        media: carousel.mediaContent
          ? URL.createObjectURL(carousel.mediaContent)
          : null,
      })),
    };

    setPreview(previewData);
  }, [
    message,
    selectedDate,
    selectedTime,
    mediaContent,
    callToAction,
    quickReply,
    mediaCarouselsContent,
    carousels,
  ]); // Add carousels to dependencies

  useEffect(() => {
    resetForm.current = resetStates;
  }, [resetForm]);

  return (
    <div className="flex h-[95vh] gap-[2%] ">
      <ToastContainer />
      <div className="left-content grow xl:basis-[70%] pr-4 overflow-y-auto scrollbar-hide">
        {currentPage === 1 && (
          <>
            <h2 className="text-lg font-bold border-b-2 pb-4">New Broadcast</h2>
            <div className="flex gap-5 mt-5">
              <Input
                label="Broadcast Name"
                type="text"
                value={broadcastName}
                onChange={(e) => setBroadcastName(e.target.value)}
                placeholder="Broadcast Name"
                className="grow"
              />

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
              <label className="mt-4 font-medium block">Template</label>

              {/* dropdowncomponent */}
              <Dropdown
                className="max-w-[48%]"
                options={Object.entries(templates).map(([id, name]) => ({
                  id,
                  name,
                }))}
                value={selectedTemplate}
                onChange={handleTemplateChange}
                placeholder="Select Template"
                valueKey="id"
              />
              {/* dropdowncomponent */}
              {/* textboxcomponent */}

              <label className="flex flex-col mt-4 font-medium">
                Message
                <textarea
                  className="rounded-md px-2 py-2 mt-1 border outline-none font-normal"
                  rows="6"
                  value={message}
                  readOnly
                ></textarea>
              </label>
              {/* textboxcomponent */}
              <label className="flex flex-col mt-4 font-medium">
                footer
                <textarea
                  className="rounded-md px-2 py-2 mt-1 border outline-none font-normal"
                  rows="1"
                  value={footer}
                  readOnly
                ></textarea>
              </label>
            </div>

            {renderCallToActionSection()}

            {/* Render carousels with media upload options */}
            {carousels.length > 0 && (
              // Container for the entire carousel section
              <div className="mt-4">
                <h3 className="font-medium text-lg">Carousel</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {carousels.map((carousel, index) => (
                    // Individual carousel item container
                    <div
                      key={`carousel-${index}`}
                      className="bg-white shadow-md rounded-lg p-4 overflow-hidden"
                    >
                      <h4 className="font-medium text-md mb-2">
                        {carousel.title}
                      </h4>
                      {carousel.mediaContent ? (
                        carousel.mediaType === "Image" ? (
                          // Display image
                          <img
                            src={URL.createObjectURL(carousel.mediaContent)}
                            alt={carousel.title}
                            className="w-full h-32 object-cover rounded mt-2"
                            style={{ objectFit: "cover" }}
                          />
                        ) : carousel.mediaType === "Video" ? (
                          // Display video
                          <video
                            controls
                            src={URL.createObjectURL(carousel.mediaContent)}
                            className="w-full h-32 object-cover rounded mt-2"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          // Display PDF or other types of media
                          <embed
                            src={URL.createObjectURL(carousel.mediaContent)}
                            type="application/pdf"
                            className="w-full h-32 object-cover rounded mt-2"
                            style={{ objectFit: "cover" }}
                          />
                        )
                      ) : (
                        // Input for uploading media content
                        <input
                          type="file"
                          accept={
                            carousel.mediaType === "Image"
                              ? "image/*"
                              : carousel.mediaType === "Video"
                              ? "video/*"
                              : "image/*,video/*,.pdf"
                          }
                          onChange={(e) => handleCarouselsMediaUpload(e, index)}
                          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )}
                      <p className="text-gray-600 mt-2 text-sm">
                        {carousel.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* attibutes */}
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Attributes</h2>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.keys(attributes).map((key) => (
                  <label key={key} className="flex flex-col font-medium">
                    {key}
                    <input
                      type="text"
                      className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal"
                      value={attributes[key]}
                      onChange={(e) =>
                        handleAttributeChange(key, e.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
            {/* attibutes */}
            {/* datetime */}
            <div className="font-medium mt-4">
              <h3>Scheduled Start Date</h3>

              <div className="flex gap-5 mt-1">
                <label className="flex flex-col grow">
                  Date
                  <input
                    type="date"
                    className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal text-gray-400"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                    }}
                  />
                </label>

                <label className="flex flex-col grow">
                  Time
                  <input
                    type="time"
                    className="rounded-md px-2 py-[2px] mt-1 border outline-none font-normal text-gray-400"
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                    }}
                  />
                </label>
              </div>
            </div>
            {/* datetime */}
            <button
              className="bg-blue-600 text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-blue-500 mt-4"
              onClick={handleNextPage}
            >
              Next
            </button>
          </>
        )}
        {/* 2ndpage */}
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
                    <span className="font-medium">Import from CSV</span>
                    <input
                      type="file"
                      name="csvFile"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="ml-2"
                    />
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
              onClick={() => {
                setShowGroupModal(true);
                fetchTemplateGroups();
              }}
              className="btn btn-success my-5 text-gray-50"
            >
              Import Contacts From Group
            </button>

            {headerMediaType &&
              headerMediaType !== "None" &&
              headerMediaType !== "null" &&
              headerMediaType !== "" &&
              headerMediaType !== "NULL" && (
                <div>
                  <h3 className="font-semibold">Upload Media</h3>

                  <div className="flex gap-5">
                    <input
                      type="file"
                      name="mediaFile"
                      accept={
                        headerMediaType === "Image"
                          ? "image/*"
                          : headerMediaType === "Video"
                          ? "video/*"
                          : "image/*,video/*,.pdf"
                      }
                      onChange={handleMediaUpload}
                      className="mt-4"
                    />
                    <button
                      type="button"
                      onClick={handleImportFromFileManager}
                      className="btn mt-4"
                    >
                      Import from File Manager
                    </button>
                  </div>

                  <div>
                    {mediaContent && (
                      <div className="mt-2">
                        {headerMediaType === "Image" && (
                          <img
                            src={URL.createObjectURL(mediaContent)}
                            alt="Uploaded Media"
                            className="mt-2 rounded"
                            style={{ maxHeight: "150px" }}
                          />
                        )}
                        {headerMediaType === "Video" && (
                          <video
                            controls
                            src={URL.createObjectURL(mediaContent)}
                            className="mt-2 rounded"
                            style={{ maxHeight: "150px" }}
                          />
                        )}
                        {headerMediaType === "Document" && (
                          <embed
                            src={URL.createObjectURL(mediaContent)}
                            type="application/pdf"
                            className="mt-2 rounded"
                            style={{ maxHeight: "150px" }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
        {/* 2ndpage */}

        {showGroupModal && (
          <div className="fixed z-20 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="mt-6 border p-5 bg-white relative">
              <img
                src="/assets/images/svg/CrossIcon.svg"
                width={20}
                height={20}
                alt="cross icon"
                className="absolute top-5 right-5 cursor-pointer"
                onClick={() => setShowGroupModal(false)}
              />

              <h3 className="text-xl">Import Contacts From Group</h3>

              <div className="flex gap-10 justify-between my-6">
                <p>
                  Show{" "}
                  <select className="border px-2 mx-1">
                    <option value="10">10</option>
                  </select>{" "}
                  entries
                </p>
                <p>
                  Search <input type="text" className="border" />
                </p>
              </div>

              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">S.No</th>
                    <th className="border p-2">Group name</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group, index) => (
                    <tr key={index}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{group}</td>
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
                  disabled={(currentCsvPage + 1) * 5 >= csvData.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden xl:basis-[28%] xl:flex flex-col items-center">
        <h2 className="font-medium text-center text-2xl mb-3">Preview</h2>

        <>
          <Mobile data={preview} />
        </>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default NewBroadcast;
