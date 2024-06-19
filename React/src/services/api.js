import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("Base URL not specified");
}

export const SIGN_UP = `${API_BASE_URL}/registration`;
export const LOGIN = `${API_BASE_URL}/login`;
export const MOBILE = `${API_BASE_URL}/mobileotp`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const signUp = (userData) => {
    return api.post(SIGN_UP, userData);
};

export const login = (userData) => {
    return api.post(LOGIN, userData);
};

export const requestMobileOtp = (mobile) => {
    return api.post(MOBILE, { mobile });
};

export default api;

export const templateData = [
    {
        id: 1,
        name: "Template1",
        message: `This is the message for Template1 {{name1}}. This is to inform you that you are selected as SDE1 {{name2}}`,
    },
    {
        id: 2,
        name: "Template2",
        message:
            "{{name1}} जीवनातील प्रत्येक नात्यात स्त्री ही महत्वाची असते किंबहुना स्त्रीच्या अस्तित्वानेच त्या नात्याला अर्थ येतो. आज याच स्त्रीत्वचा गौरव करणारा महिला दिन. स्वतःचे स्त्रीत्व जपत भारतदेशातील अनेक महान स्त्रियांनी आपल्यापुढे  महान आदर्श घालून दिला. आज तोच आदर्श जपण्याची वेळ आहे.{{name2}} कोपरगाव मतदारसंघामध्ये महिलांसाठी विविध कार्यक्रम आयोजित करीत आपण माताभगिनींना मुक्त व्यासपीठ उपलब्ध करून दिले. मग ते दिवाळी हाट असो किंवा नवरात्र. महिलांच्या उन्नतीसाठी अशाच प्रकारे इथून पुढच्या काळातही प्रयत्न केले जातील. तुमच्या परिवारातील एक सदस्य म्हणून महिलांचे प्रश्न सोडविण्यासाठी त्यांना विविध कल्याणकारी योजनांचा लाभ मिळवून देण्यासाठी मी कटिबद्ध आहे.{{name3}} सर्व महिलांना जागतिक महिला दिनाच्या हार्दिक शुभेच्छा.",
    },
    {
        id: 3,
        name: "Template3",
        message: "This is the message for Template3.",
    },
    {
        id: 4,
        name: "Template4",
        message: "This is the message for Template4.",
    },
];
