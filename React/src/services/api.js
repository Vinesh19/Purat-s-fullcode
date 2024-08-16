import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("Base URL not specified");
}

export const SIGN_UP = `${API_BASE_URL}/registration`;
export const LOGIN = `${API_BASE_URL}/login`;
export const MOBILE_OTP = `${API_BASE_URL}/send-mobile-otp`;
export const VERIFY_MOBILE_OTP = `${API_BASE_URL}/verify-mobile-otp`;
export const SEND_EMAIL_OTP = `${API_BASE_URL}/send-email-otp`;
export const VERIFY_EMAIL_OTP = `${API_BASE_URL}/verify-email-otp`;
export const CHANGE_PASSWORD = `${API_BASE_URL}/update-password`;
export const LOGOUT = `${API_BASE_URL}/logout`;
export const TEMPLATE_DATA = `${API_BASE_URL}/template`;
export const NEW_DASHBOARD_TEMPLATE_GROUP = `${API_BASE_URL}/fetching-group-names`;
export const SUBMIT_BROADCAST_DATA = `${API_BASE_URL}/insert-broadcast-data`;
export const CHATS_LIST = `${API_BASE_URL}/filtered-data`;
export const CHAT_STATUS = `${API_BASE_URL}/chat-message-room/update`;
export const ADVANCE_FILTER_CHAT_DATA = `${API_BASE_URL}/advance-filtered-data`;
export const CHAT_DATA = `${API_BASE_URL}/chat-messages`;
export const AGENTS_LIST = `${API_BASE_URL}/assign-users`;
export const QUICK_REPLIES = `${API_BASE_URL}/quick-replies`;
export const USER_NOTES = `${API_BASE_URL}/chat-inbox/note`;
export const USER_TAGS = `${API_BASE_URL}/chat-inbox/tag`;
export const CRM_CHATS = `${API_BASE_URL}/crm/all-chat`;
export const CRM_CHAT_DETAILS = `${API_BASE_URL}/crm/specific-chat`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add Authorization header to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token && ![SIGN_UP, LOGIN].includes(config.url)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Export API functions
export const signUp = (userData) => {
    return api.post(SIGN_UP, userData);
};

export const login = (userData) => {
    return api.post(LOGIN, userData);
};

export const requestMobileOtp = (mobile_no) => {
    return api.post(MOBILE_OTP, { mobile_no });
};

export const verifyMobileOtp = (mobile_no, otp) => {
    return api.post(VERIFY_MOBILE_OTP, { mobile_no, otp });
};

export const requestEmailOtp = (email) => {
    return api.post(SEND_EMAIL_OTP, { email });
};

export const verifyEmailOtp = (email, otp) => {
    return api.post(VERIFY_EMAIL_OTP, { email, otp });
};

export const changePassword = (email, password, password_confirmation) => {
    return api.post(CHANGE_PASSWORD, {
        email,
        password,
        password_confirmation,
    });
};

export const logout = () => {
    return api.post(LOGOUT);
};

export const templateData = (data) => {
    return api.post(TEMPLATE_DATA, data);
};

export const templateGroups = (user) => {
    return api.post(NEW_DASHBOARD_TEMPLATE_GROUP, user);
};

export const submitBroadcastData = (data) => {
    return api.post(SUBMIT_BROADCAST_DATA, data);
};

export const fetchAllChats = (action) => {
    return api.post(CHATS_LIST, action);
};

export const fetchSelectedChatData = (payload) => {
    return api.post(CHAT_DATA, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateChatStatus = (payload) => {
    return api.post(CHAT_STATUS, payload);
};

export const advanceFilterChatData = (data) => {
    return api.post(ADVANCE_FILTER_CHAT_DATA, data);
};

export const fetchAgentsName = (payload) => {
    return api.post(AGENTS_LIST, payload);
};

export const handleQuickReplies = (payload) => {
    return api.post(QUICK_REPLIES, payload);
};

export const handleQuickRepliesFormData = (formData) => {
    return api.post(QUICK_REPLIES, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const fetchUserNotes = (payload) => {
    return api.post(USER_NOTES, payload);
};

export const fetchUserTags = (payload) => {
    return api.post(USER_TAGS, payload);
};

export const fetchCrmChats = (user) => {
    return api.post(CRM_CHATS, user);
};

export const fetchCrmSpecificChat = (payload) => {
    return api.post(CRM_CHAT_DETAILS, payload);
};

export default api;
