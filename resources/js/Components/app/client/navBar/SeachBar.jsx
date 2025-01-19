import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import UserAvatar from "@/Components/UI/client/UserAvatar";
import { Link } from "@inertiajs/react";


const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`/search-users?query=${encodeURIComponent(query)}`);
                const data = await response.json();
                console.log(data.searchResults);
                setSearchResults(data.searchResults || []);
                setShowSearchResults(true);
            } catch (error) {
                console.error("Search failed", error);
                setSearchResults([]);
                setShowSearchResults(false);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowSearchResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative search-container" ref={searchRef}>
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-72 px-5 py-1 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 backdrop-blur-sm"
            />
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((user, index) => (
                        <Link
                            href={`${user.email}`}
                            key={index}
                            className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setSearchQuery("");
                                setShowSearchResults(false);
                            }}
                        >
                            <UserAvatar user={user} size="medium" useLink={false} />
                            <span className="font-medium">{user.first_name} {user.sur_name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
};

export default SearchBar;