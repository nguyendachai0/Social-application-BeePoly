import GuestLayout from '@/Layouts/GuestLayout';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Head, Link, useForm  } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [isLogin, setIsLogin] = useState(true);
    const { data, setData, post, processing, reset } = useForm({
            email: "",
            password: "",
            password_confirmation: "",
            firstName:  "",
            lastName:   "",
          });

          const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };


      const [errors, setErrors] = useState({});
    const [isSliding, setIsSliding] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            setErrors((prev) => ({
                ...prev,
                password_confirmation: "Passwords do not match",
            }));
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    
        let newErrors = { ...errors };
        if (name === "email" && !validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else if (name === "email") {
          delete newErrors.email;
        }
    
        if (name === "password" && value.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        } else if (name === "password") {
          delete newErrors.password;
        }

        if (name === "password_confirmation") {
            if (value !== data.password) {
                newErrors.passwordConfirmation = "Passwords do not match";
            } else {
                delete newErrors.passwordConfirmation;
            }
        }
    
        setErrors(newErrors);
      };

      const toggleForm = () => {
        setIsSliding(true);
        setTimeout(() => {
          setIsLogin(!isLogin);
          setIsSliding(false);
        }, 500);
        setData({ email: "", password: "", passwordConfirmation: "", firstName: "", lastName: "" });
        setErrors({});
      };

    return (
        
           

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md relative">
        <div
          className={`bg-white rounded-lg shadow-2xl overflow-hidden transform transition-transform duration-500 ${isSliding ? (isLogin ? "-translate-x-full" : "translate-x-full") : "translate-x-0"}`}
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={data.firstName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Họ"
                      aria-label="First Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={data.lastName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tên"
                      aria-label="Last Name"
                      required
                    />
                  </div>
                </div>
                </>
                
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="you@example.com"
                    aria-label="Email Address"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật Khẩu
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="********"
                    aria-label="Password"
                    required
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Xác Nhận Mật Khẩu</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${errors.password_confirmation ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        placeholder="********"
                                        aria-label="Confirm Password"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-500" role="alert">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                 </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-200 hover:scale-105"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}
