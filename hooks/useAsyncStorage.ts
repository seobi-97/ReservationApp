import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(error);
    }
};

export const multiSetItem = async (items: readonly (readonly [string, string])[]) => {
    try {
        await AsyncStorage.multiSet(items);
    } catch (error) {
        console.error(error);
    }
};

export const getItem = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value || '';
    } catch (error) {
        console.error(error);
    }
};

export const multiGetItem = async (keys: string[]) => {
    try {
        const values = await AsyncStorage.multiGet(keys);
        return values;
    } catch (error) {
        console.error(error);
    }
};

export const removeItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(error);
    }
};

export const multiRemoveItem = async (keys: string[]) => {
    try {
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error(error);
    }
};
