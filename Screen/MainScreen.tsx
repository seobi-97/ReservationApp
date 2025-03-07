import React from "react";
import { View, Text, Button, useColorScheme, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/authSlice";
import { RootState, AppDispatch } from "../redux/store";

const useTypedDispatch = () => useDispatch<AppDispatch>();

export default function MainScreen() {
    const dispatch = useTypedDispatch();
    const colorScheme = useColorScheme();
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
        <Text style={[styles.text, colorScheme === 'dark' && styles.darkText]}>Main Screen</Text>
        {isAuthenticated ? (
            <>
                <Text style={[styles.text, colorScheme === 'dark' && styles.darkText]}>Welcome, {user?.name}</Text>
                <Button title="Logout" onPress={() => dispatch(logout())} />
            </>
        ) : (
            <>
                <Text style={[styles.text, colorScheme === 'dark' && styles.darkText]}>Please login to continue</Text>
                <Button title="Login" onPress={() => dispatch(login({
                    user: {
                        id: '1',
                        name: 'John Doe',
                        email: 'john@example.com',
                    },
                    token: '1234567890',
                }))} />
            </>
        )}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkContainer: {
        backgroundColor: '#000',
    },
    text: {
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
});
