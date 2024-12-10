import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const HealthyUsageReminderContext = createContext();

export const HealthyUsageReminderProvider = ({ children }) => {
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed > 3600000 ) { 
                toast.info("You've been online for a while. Take a break!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setReminderShown(true);
            }
        }, 3600000); 

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <HealthyUsageReminderContext.Provider value={{ resetTimer: () => setStartTime(Date.now()) }}>
            {children}
        </HealthyUsageReminderContext.Provider>
    );
};
