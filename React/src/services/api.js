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
export const NEW_DASHBOARD_TEMPLATE = `${API_BASE_URL}/template-name`;
export const NEW_DASHBOARD_TEMPLATE_MESSAGE = `${API_BASE_URL}/template`;
export const NEW_DASHBOARD_TEMPLATE_GROUP = `${API_BASE_URL}/fetching-group-names`;
export const SUBMIT_BROADCAST_DATA = `${API_BASE_URL}/insert-broadcast-data`;
export const SEARCH_FILTERED_DATA = `${API_BASE_URL}/filtered-data`;

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

export const templateData = (user) => {
    return api.post(NEW_DASHBOARD_TEMPLATE, user);
};

export const fetchTemplateMessage = (templateId) => {
    return api.get(`${NEW_DASHBOARD_TEMPLATE_MESSAGE}/${templateId}`);
};

export const templateGroups = (user) => {
    return api.post(NEW_DASHBOARD_TEMPLATE_GROUP, user);
};

export const submitBroadcastData = (data) => {
    return api.post(SUBMIT_BROADCAST_DATA, data);
};

export const searchFilteredData = (search) => {
    return api.post(SEARCH_FILTERED_DATA, search);
};

export default api;

export const TeamInbox = [
    {
        id: "1",
        name: "Active chats",
        message: [
            "We’re glad you want to know about WATI, Vinesh Wadhwani 😃",
            "Hi sairam vengalasetty 👋,Thank you for your message.How can we help you today?",
            "Please check out the attached video to get an overview of our platform 📺 and how to sign up for a WATI account 🚀.",
        ],
    },
    {
        id: "2",
        name: "Broadcasts",
        message: [
            "Hi sairam vengalasetty 👋,Thank you for your message.How can we help you today?",
        ],
    },
    {
        id: "3",
        name: "Unassigned",
        message: [
            "Please check out the attached video to get an overview of our platform 📺 and how to sign up for a WATI account 🚀.",
        ],
    },
    {
        id: "4",
        name: "Unread",
        message: [
            "Hi sairam vengalasetty 👋,Thank you for your message.How can we help you today?",
        ],
    },
    {
        id: "5",
        name: "last 24 Hours",
        message: ["We’re glad you want to know about WATI, Vinesh Wadhwani 😃"],
    },
    {
        id: "6",
        name: "Assigned to me",
        message: [
            "Please check out the attached video to get an overview of our platform 📺 and how to sign up for a WATI account 🚀.",
        ],
    },
    {
        id: "7",
        name: "Favourite only",
        message: ["We’re glad you want to know about WATI, Vinesh Wadhwani 😃"],
    },
    {
        id: "8",
        name: "Open",
        message: [
            "Hi sairam vengalasetty 👋,Thank you for your message.How can we help you today?",
        ],
    },
    {
        id: "9",
        name: "Pending",
        message: [
            "Please check out the attached video to get an overview of our platform 📺 and how to sign up for a WATI account 🚀.",
        ],
    },
];

export const ContactList = [
    { id: "1", name: "9090119192" },
    { id: "2", name: "939892723" },
    { id: "3", name: "6767283923" },
    { id: "4", name: "43874834834" },
    { id: "5", name: "939892723" },
    { id: "6", name: "4934988555" },
    { id: "7", name: "7873393033" },
    { id: "8", name: "939892723" },
];

export const filterStatus = [
    { id: "1", name: "Attribute" },
    { id: "2", name: "Assignee" },
    { id: "3", name: "Status" },
    { id: "4", name: "Team" },
    { id: "5", name: "Tag" },
];

export const filterAttribute = [
    { id: "1", name: "Attribute1" },
    { id: "2", name: "Attribute2" },
    { id: "3", name: "Attribute3" },
    { id: "4", name: "Attribute4" },
    { id: "5", name: "Attribute5" },
    { id: "6", name: "Attribute6" },
    { id: "7", name: "Attribute7" },
    { id: "8", name: "Attribute8" },
    { id: "9", name: "Attribute9" },
    { id: "10", name: "Attribute10" },
    { id: "11", name: "Attribute11" },
    { id: "12", name: "Attribute12" },
];

export const filterOperation = [
    { id: "1", name: "=" },
    { id: "2", name: "!=" },
];
