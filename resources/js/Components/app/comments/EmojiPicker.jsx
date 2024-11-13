import { BsEmojiSmile, BsEmojiAngry, BsEmojiLaughing, BsEmojiHeartEyes, BsEmojiSunglasses, BsEmojiWink, BsEmojiKiss, BsStars, BsEmojiFrown } from "react-icons/bs";

const emojis = [
  { icon: <BsEmojiSmile className="text-yellow-500 hover:scale-110 transition-transform" />, emoji: "😊" },
  { icon: <BsEmojiAngry className="text-red-500 hover:scale-110 transition-transform" />, emoji: "😡" },
  { icon: <BsEmojiLaughing className="text-orange-500 hover:scale-110 transition-transform" />, emoji: "😂" },
  { icon: <BsEmojiHeartEyes className="text-pink-500 hover:scale-110 transition-transform" />, emoji: "😍" },
  { icon: <BsEmojiSunglasses className="text-blue-500 hover:scale-110 transition-transform" />, emoji: "😎" },
  { icon: <BsEmojiWink className="text-purple-500 hover:scale-110 transition-transform" />, emoji: "😉" },
  { icon: <BsEmojiKiss className="text-red-500 hover:scale-110 transition-transform" />, emoji: "😘" },
  { icon: <BsStars className="text-blue-400 hover:scale-110 transition-transform" />, emoji: "✨" },
  { icon: <BsEmojiFrown className="text-gray-400 hover:scale-110 transition-transform" />, emoji: "🙁" },
];

const EmojiPicker = ({ setComment, handleEmojiClick }) => {
  const handleClick = (emoji) => {
    setComment((prev) => prev + emoji);
  };

  return (
    <div className="absolute right-0 mb-3 bg-white shadow-lg rounded-lg p-1 z-10 translate-y-10">
    <div className="flex gap-2">
      {emojis.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleEmojiClick(item.emoji)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {item.icon}
        </button>
      ))}
    </div>
  </div>
  );
};

export default EmojiPicker;
