const Mobile = ({ data }) => {
    const {
        callPhoneNumber,
        callPhoneText,
        visitWebsiteText,
        visitWebsiteUrl,
    } = data?.action || {};
    const { quickReply1, quickReply2, quickReply3 } = data?.reply || {};

    const renderMedia = () => {
        if (data?.media_file && data?.media_type) {
            if (data.media_type.startsWith("image")) {
                return (
                    <img
                        src={data.media_file}
                        alt="Media Content"
                        className="w-screen h-28 rounded-lg"
                    />
                );
            } else if (data.media_type.startsWith("video")) {
                return (
                    <video
                        src={data.media_file}
                        controls
                        className="rounded-t-lg w-full h-auto"
                    ></video>
                );
            } else if (data.media_type === "application/pdf") {
                return (
                    <embed
                        src={data.media_file}
                        type="application/pdf"
                        className="rounded-t-lg w-full h-auto"
                    />
                );
            }
        }
        return null;
    };

    const renderCallToActionButtons = () => (
        <div className="mt-2">
            {visitWebsiteText && visitWebsiteUrl && (
                <a
                    className="flex gap-2 justify-center items-end text-blue-500 active:text-purple-600 cursor-pointer border-b-2 pb-2"
                    onClick={() => (window.location.href = visitWebsiteUrl)}
                >
                    <img
                        src="/assets/images/svg/icon-web.svg"
                        width={16}
                        height={16}
                        alt="web-icon"
                    />
                    {visitWebsiteText}
                </a>
            )}
            {callPhoneText && callPhoneNumber && (
                <a
                    className="flex gap-2 justify-center text-blue-500 active:text-purple-600 cursor-pointer pt-1"
                    onClick={() =>
                        (window.location.href = `tel:${callPhoneNumber}`)
                    }
                >
                    <i className="fas fa-phone text-lg"></i>
                    {callPhoneText}
                </a>
            )}
        </div>
    );

    const renderQuickReplyButtons = () => (
        <div className="mt-1">
            {quickReply1 && (
                <button
                    className="bg-slate-50 flex justify-center items-center gap-2 w-full p-2 rounded-md mb-1"
                    onClick={() => console.log(quickReply1)}
                >
                    <img
                        src="/assets/images/svg/reply2.svg"
                        width={16}
                        height={16}
                        alt="web-icon"
                    />
                    {quickReply1}
                </button>
            )}
            {quickReply2 && (
                <button
                    className="bg-slate-50 flex justify-center items-center gap-2 w-full p-2 rounded-md mb-1"
                    onClick={() => console.log(quickReply2)}
                >
                    <img
                        src="/assets/images/svg/reply2.svg"
                        width={16}
                        height={16}
                        alt="web-icon"
                    />
                    {quickReply2}
                </button>
            )}
            {quickReply3 && (
                <button
                    className="bg-slate-50 flex justify-center items-center gap-2 w-full p-2 rounded-md "
                    onClick={() => console.log(quickReply3)}
                >
                    <img
                        src="/assets/images/svg/reply2.svg"
                        width={16}
                        height={16}
                        alt="web-icon"
                    />
                    {quickReply3}
                </button>
            )}
        </div>
    );

    return (
        <div className="mobile-ui bg-white rounded-3xl border-[14px] border-white shadow-2xl flex flex-col h-[82vh]">
            <div className="p-2 flex items-center justify-between bg-[#3ea663] rounded-t-lg">
                <div className="flex items-center gap-2">
                    <i className="fas fa-arrow-left text-white text-xl"></i>
                    <i className="fas fa-user-circle text-white text-3xl"></i>
                </div>
                <div className="flex gap-4">
                    <i className="fas fa-video text-white text-lg"></i>
                    <i className="fas fa-phone text-white text-lg"></i>
                    <i className="fas fa-ellipsis-v text-white text-lg"></i>
                </div>
            </div>

            <div
                id="messages"
                className="flex-1 p-3 overflow-auto w-[85%] scrollbar-hide"
            >
                {data?.message && (
                    <div className="bg-slate-50 p-2 rounded-lg border-slate-700">
                        {renderMedia()}
                        <div className="rounded-b-lg p-2 mt-1">
                            <p>{data?.message}</p>
                            <div className="text-right text-xs text-gray-500 border-b-2 py-2">
                                {data?.delivery_time}
                            </div>
                            {(callPhoneNumber ||
                                callPhoneText ||
                                visitWebsiteText ||
                                visitWebsiteUrl) &&
                                renderCallToActionButtons()}
                        </div>
                    </div>
                )}
                {(quickReply1 || quickReply2 || quickReply3) &&
                    renderQuickReplyButtons()}
            </div>

            <div className="flex items-center p-2 gap-2 bg-gray-300 rounded-b-lg">
                <div className="flex items-center bg-gray-200 rounded-full p-1 gap-2 flex-grow">
                    <i className="far fa-smile text-gray-600 text-lg"></i>
                    <input
                        type="text"
                        id="messageInput"
                        className="flex-grow bg-transparent placeholder-gray-600 outline-none w-36"
                        placeholder="Message"
                        autoFocus
                    />
                    <i className="fas fa-paperclip text-gray-600 text-lg rotate-[-45deg]"></i>
                    <i className="fas fa-inr text-gray-600 text-lg"></i>
                    <i className="fas fa-camera text-gray-600 text-lg"></i>
                </div>
                <div className="bg-green-500 cursor-pointer w-8 h-8 rounded-full flex justify-center items-center">
                    <img
                        src="/assets/images/svg/send-icon.svg"
                        width={16}
                        height={16}
                        alt="send"
                    />
                </div>
            </div>
        </div>
    );
};

export default Mobile;
