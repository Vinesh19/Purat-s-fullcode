import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("Base URL not specified");
}

export const SIGN_UP = `${API_BASE_URL}/registration`;
export const LOGIN = `${API_BASE_URL}/login`;
export const MOBILE_OTP = `${API_BASE_URL}/mobileotp`;
export const NEW_DASHBOARD_TEMPLATE = `${API_BASE_URL}/template-name`;
export const NEW_DASHBOARD_TEMPLATE_MESSAGE = `${API_BASE_URL}/template`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const signUp = (userData) => {
    return api.post(SIGN_UP, userData);
};

export const login = (userData) => {
    return api.post(LOGIN, userData);
};

export const requestMobileOtp = () => {
    return api.get(MOBILE_OTP);
};

export const templateData = () => {
    return api.get(NEW_DASHBOARD_TEMPLATE);
};

export const fetchTemplateMessage = (templateId) => {
    return api.get(`${NEW_DASHBOARD_TEMPLATE_MESSAGE}/${templateId}`);
};

export default api;
