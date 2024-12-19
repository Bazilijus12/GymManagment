import { useState } from "react";
import { registerUser } from "../../api"; // Import the registerUser function

const useRegisterForm = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(""); // Clear errors as the user types
    };

    const validateForm = () => {
        const { userName, email, password } = formData;
        if (!userName || !email || !password) {
            setError("All fields are required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format.");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setMessage("");
        setError("");

        try {
            // Call the centralized registerUser function
            await registerUser(formData);
            setMessage("Registration successful! You can now log in.");
            setFormData({ userName: "", email: "", password: "" });
        } catch (err) {
            // Handle API errors
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        message,
        error,
        loading,
    };
};

export default useRegisterForm;
