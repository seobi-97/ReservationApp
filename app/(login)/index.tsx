import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { login } from '../../apis/api';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function LoginScreen({navigation}: {navigation: any}) {
    const colorScheme = useColorScheme();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isDirty, setIsDirty] = useState({
        email: false,
        password: false,
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        if(!isDirty[field as keyof typeof isDirty]) {
            setIsDirty(prev => ({...prev, [field]: true}));
        }
    }

    useEffect(() => {
        if(isDirty.email) validateEmail(formData.email);
        if(isDirty.password) validatePassword(formData.password);
    }, [formData, isDirty]);
    
    const validateEmail = (email: string) => {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!pattern.test(email)) {
            setErrors(prev => ({...prev, email: '이메일 형식이 올바르지 않습니다.'}));
        } else {
            setErrors(prev => ({...prev, email: ''}));
        }
    }
    const validatePassword = (password: string) => {
        if(password.length < 8) {
            setErrors(prev => ({...prev, password: '비밀번호는 8자 이상이어야 합니다.'}));
        } else {
            setErrors(prev => ({...prev, password: ''}));
        }
    }

    const handleLogin = async () =>{
        if(errors.email || errors.password) {
            return;
        }
        try {
            const response = await login(formData.email, formData.password);
            Alert.alert('로그인 성공', '로그인이 완료되었습니다.');
            navigation.navigate('(home)');
        } catch (error) {
            console.error('로그인 실패:', error);
            Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    }
    const handleSignup = () => {
        navigation.navigate('(signup)');
    }

    return (
        <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>로그인</Text>
            <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
                placeholder="이메일"
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
            />  
            <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
                placeholder="비밀번호"
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                secureTextEntry
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, colorScheme === 'dark' && styles.darkButton]} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, colorScheme === 'dark' && styles.darkButton]} onPress={handleSignup}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        width: '40%',
        alignSelf: 'center',
    },
    buttonContainer: {
        width: '100%',
    },
    darkButton: {
        backgroundColor: '#rgba(33,150,243,1.00)',
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(33,150,243,1.00)',
        padding: 10,
        marginTop: 5,
    },  
    buttonText: {
        color: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#000000',
    },
    darkText: {
        color: '#ffffff',
    },
    lightText: {
        color: '#000000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    darkInput: {
        backgroundColor: '#1e1e1e', 
        color: '#ffffff',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
