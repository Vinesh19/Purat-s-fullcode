import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("Base URL not specified");
}

export const SIGN_UP = `${API_BASE_URL}/registration`;
export const LOGIN = `${API_BASE_URL}/login`;
export const MOBILE_OTP = `${API_BASE_URL}/send-mobile-otp`;
export const VERIFY_MOBILE_OTP = `${API_BASE_URL}/verify-mobile-otp`;
export const LOGOUT = `${API_BASE_URL}/logout`;
export const NEW_DASHBOARD_TEMPLATE = `${API_BASE_URL}/template-name`;
export const NEW_DASHBOARD_TEMPLATE_MESSAGE = `${API_BASE_URL}/template`;
export const NEW_DASHBOARD_TEMPLATE_GROUP = `${API_BASE_URL}/fetching-group-data`;
export const SUBMIT_BROADCAST_DATA = `${API_BASE_URL}/insert-broadcast-data`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

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

export const logout = () => {
    return api.post(LOGOUT);
};

export const templateData = () => {
    return api.get(NEW_DASHBOARD_TEMPLATE);
};

export const fetchTemplateMessage = (templateId) => {
    return api.get(`${NEW_DASHBOARD_TEMPLATE_MESSAGE}/${templateId}`);
};

export const submitBroadcastData = (data) => {
    return api.post(SUBMIT_BROADCAST_DATA, data);
};

export default api;
