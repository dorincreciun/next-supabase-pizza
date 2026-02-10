export const validateEmail = (email: string): string | true => {
    if (!email) return "Email-ul este obligatoriu";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Formatul email-ului este invalid";
    }

    if (email.length > 150) {
        return "Email-ul este prea lung";
    }

    return true;
};