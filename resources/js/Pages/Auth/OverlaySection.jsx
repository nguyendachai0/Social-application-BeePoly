const OverlaySection = ({ isLogin, toggleForm }) => {

    return (
    <div 
                className={`absolute top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out bg-gradient-to-br from-purple-600 to-blue-500 md:flex items-center justify-center hidden
                ${isLogin ? "md:translate-x-full" : ""}`}
            >
                <div className="text-center text-white p-8 transform transition-all duration-1000 ease-in-out">
                <h3 className="text-3xl font-bold mb-4 animate-slide-up">
                    {isLogin ? "Hello, Friend!" : "Welcome Back!"}
                </h3>
                <p className="text-lg mb-8 animate-slide-up delay-100">
                    {isLogin
                    ? "Enter your personal details and start your journey with us"
                    : "To keep connected with us please login with your personal info"}
                </p>
                <button
                    onClick={toggleForm}
                    className="border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 animate-slide-up delay-200"
                >
                    {isLogin ? "Sign Up" : "Sign In"}
                </button>
                </div>
            </div>)

    }
export default OverlaySection;