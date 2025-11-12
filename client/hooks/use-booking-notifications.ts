'use client';

import { useEffect, useState } from 'react';
import { initSocket, connectSocket, disconnectSocket } from '@/lib/socket';
import config from '@/config/env';

interface NewBooking {
    message: string;
    booking: object;
    timestamp: Date;
}

export const useBookingNotifications = (restaurantId: string | null) => {
    const [newBooking, setNewBooking] = useState<NewBooking | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!restaurantId) return;

        const backendUrl = config.PUBLIC_BACKEND_URL!;
        const socket = initSocket(backendUrl);

        connectSocket();

        const handleConnect = () => {
            console.log('Socket connected');
            setIsConnected(true);

            socket.emit('join-restaurant', restaurantId);
        };

        const handleDisconnect = () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        };

        const handleNewBooking = (data: NewBooking) => {
            console.log('New booking received:', data);
            setNewBooking(data);

            if (Notification.permission === 'granted') {
                new Notification('New Booking Alert!', {
                    body: data.message,
                    icon: '/icon.png',
                });
            }
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('new-booking', handleNewBooking);

        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('new-booking', handleNewBooking);
            socket.emit('leave-restaurant', restaurantId);
            disconnectSocket();
        };
    }, [restaurantId]);

    return { newBooking, isConnected, clearNotification: () => setNewBooking(null) };
};
