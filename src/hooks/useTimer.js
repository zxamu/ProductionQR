import { useState, useEffect } from 'react';

const useTimer = (startTime) => {
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            const start = startTime.toDate(); // Convertir Timestamp de Firestore a Date
            const difference = now.getTime() - start.getTime();

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setElapsedTime(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return elapsedTime;
};

export default useTimer;