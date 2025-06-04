import React, { useState, useEffect } from 'react';
import { getItem, removeItem } from './useAsyncStorage';

export const useCheckToken = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            const accessToken = await getItem('accessToken');
            const refreshToken = await getItem('refreshToken');
            if (!accessToken || !refreshToken) {
                removeItem('accessToken');
                removeItem('refreshToken');
            }
        }, 1000 * 60 * 10);
        return () => clearInterval(interval);
    }, []);
};
