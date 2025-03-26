import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { getItem } from '../hooks/useAsyncStorage';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const Stack = createNativeStackNavigator();
    const [user, setUser] = useState<any>(undefined);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await getItem('user');
            console.log(storedUser);
            setUser(storedUser);
        };
        fetchUser();
    }, []);
    if (!loaded || user === undefined) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName={user ? '(home)' : '(login)'}>
                <Stack.Screen name='(signup)' options={{ headerShown: false }} component={require('./(signup)').default} />
                <Stack.Screen name='(login)' options={{ headerShown: false }} component={require('./(login)').default} />
                <Stack.Screen name='(home)' options={{ headerShown: false }} component={require('./(home)').default} />
            </Stack.Navigator>
            <StatusBar style='auto' />
        </ThemeProvider>
    );
}
