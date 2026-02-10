export const validatePassword = (password: string): string | true => {
    if (!password) return "Parola este obligatorie";

    if (password.length < 8) {
        return "Parola trebuie să aibă cel puțin 8 caractere";
    }

    // Verificăm dacă are cel puțin o cifră
    if (!/\d/.test(password)) {
        return "Parola trebuie să conțină cel puțin o cifră";
    }

    // Verificăm dacă are cel puțin o majusculă
    if (!/[A-Z]/.test(password)) {
        return "Parola trebuie să conțină cel puțin o majusculă";
    }

    return true;
};