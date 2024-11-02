// useAuthFormState.js
import { useState } from "react";

const UseAuthFormState = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    surName: "",
    contactInfo: "",
    dateOfBirth: "",
    gender: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.contactInfo || (!emailRegex.test(formData.contactInfo) && !phoneRegex.test(formData.contactInfo))) {
      newErrors.contactInfo = "Please enter a valid email address or phone number";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.surName?.trim()) {
      newErrors.surName = "Surname is required";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Handle submission logic here
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    isLogin,
    formData,
    errors,
    loading,
    handleSubmit,
    handleChange,
    handleDateChange,
    toggleForm,
    handleAvatarChange,
    avatar
  };
};

export default UseAuthFormState;
