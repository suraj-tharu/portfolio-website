import { useState, useEffect } from 'react';

export function useGreeting() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            setGreeting(greet);
        };

        // Initialize greeting immediately
        updateGreeting();

        // Update greeting every hour
        const interval = setInterval(updateGreeting, 3600000);
        return () => clearInterval(interval);
    }, []);

    return greeting;
}

export default useGreeting;

