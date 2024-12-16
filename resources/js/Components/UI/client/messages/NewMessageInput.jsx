import React, {useEffect,  useRef} from "react";

const NewMessageInput = ({ value, onChange, onSend}) => {
    const input = useRef();
    
    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey){
            ev.preventDefault();
            onSend();
        }
    }

    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight();
        }, 10)
        onChange(ev);
    }
        const adjustHeight = () => {
            setTimeout(() => {
                input.current.style.height = "auto";
                input.current.style.height = input.current.scrollHeight + 1 + "px";
            }, 100)
        }

        useEffect(() => {
            adjustHeight();
        },[value]);

        return (
            <textarea ref={input} value={value} rows="1" placeholder="Type a message" onKeyDown={onInputKeyDown} onChange={(ev) => onChangeEvent(ev)} className="flex-1 p-2 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50  resize-none"/>
        );
    }


export default NewMessageInput;