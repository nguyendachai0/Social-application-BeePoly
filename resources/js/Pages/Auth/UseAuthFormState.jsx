// useAuthFormState.js
import { useState } from "react";
import { format } from "date-fns";
import {toast} from 'react-toastify';
import { router } from "@inertiajs/react";


const UseAuthFormState = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [data, setData] = useState({
    firstName: "",
    surName: "",
    contactInfo: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!data.contactInfo || (!emailRegex.test(data.contactInfo) && !phoneRegex.test(data.contactInfo))) {
      newErrors.contactInfo = "Please enter a valid email address or phone number";
    }
    if (!data.password || data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if(!isLogin){
      if (!data.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!data.surName?.trim()) {
        newErrors.surName = "Surname is required";
      }
      if (!data.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      }
      if (!data.gender) {
        newErrors.gender = "Gender is required";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();

    

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);

      

      const formData = new FormData();
      formData.append('contactInfo', data.contactInfo);
      formData.append('password', data.password);
      if (!isLogin) {
        const formattedDateOfBirth = format(data.dateOfBirth, "dd/MM/yyyy");
        formData.append('firstName', data.firstName);
        formData.append('surName', data.surName);
        formData.append('dateOfBirth', formattedDateOfBirth);
        formData.append('gender', data.gender);

        if (data.avatar) {
          formData.append('avatar', data.avatar);  // Append avatar file if provided
        }
      }

      const routeName = isLogin ? '/login' : '/register'; 

      try {
        router.post(routeName, formData, {
          onStart: () => setLoading(true),  
          onFinish: () => setLoading(false),  
          onError: (error) => {
            setErrors(error);
            toast.error(error.message || 'Something went wrong!');
          },
          onSuccess: () => {
            toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
            resetForm();  // Reset form on success
          }
        });
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    } else {
      setErrors(formErrors); // Set validation errors if there are any
    }
  

    //   try {
    //     const response = await fetch(routeName, {
    //       method: 'POST',
    //       headers: {
    //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    //       },
    //       body: formData,
    //     });

    //     if (response.ok) {
    //       toast.success('Login successful!');
    //       } else {
    //         const responseData = await response.json();
    //           console.error('Error:', responseData);
    //           toast.error(responseData.message || 'Login failed. Please try again.');
    //       }

    //     if (!response.ok) {
    //       try {
    //         const errorData = await response.json();  
    //         setErrors(errorData.errors || {});  
    //       } catch (jsonError) {
    //           console.error('Failed to parse JSON error response:', jsonError);
    //           setErrors({ general: 'An unexpected error occurred.' });  
    //       }
    //     setLoading(false)
    //     } else {
    //       const result = await response.json();
    //       console.log('Success:', result);
    //       setLoading(false);
    //       resetForm(); 
    //     }
    //   } catch (error) {
    //     console.error('Error:', error);
    //     setLoading(false);
    //   }
    // } else {
    //   setErrors(formErrors); // Set validation errors if there are any
    // }
  };

  // Reset form state
  const resetForm = () => {
    setData({
      firstName: "",
      surName: "",
      contactInfo: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      avatar: null,
    });
    setErrors({});
  };

  // Handle field input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date field change (e.g., for a date picker)
  const handleDateChange = (date) => {
    setData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  // Toggle between login and registration forms
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  // Handle avatar file selection
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setErrors({ ...errors, avatar: "" });
      };
      reader.readAsDataURL(file);
      setData((prev) => ({ ...prev, avatar: file }));
    }
  };
  

  return {
    isLogin,
    data,
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
