import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signup } from '../../apis/api';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignupScreen({navigation}: {navigation: any}) {
    const colorScheme = useColorScheme(); // 색상 테마 확인

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [isDirty, setIsDirty] = useState({
        name: false,
        email: false,
        password: false,
    });

    const [errors, setErrors] = useState({
        name: '',
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
        if(isDirty.name) validateName(formData.name);
        if(isDirty.email) validateEmail(formData.email);
        if(isDirty.password) validatePassword(formData.password);
    }, [formData, isDirty]);

    const validateName = (name: string) => {
        if(name.length < 2){
            setErrors(prev => ({...prev, name: '이름은 2자 이상이어야 합니다.'}));
        } else {
            setErrors(prev => ({...prev, name: ''}));
        }
    }

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
    const handleSignup = async () => {
        if(errors.name || errors.email || errors.password) {
            return;
        }
        try {
            const response = await signup(formData.name, formData.email, formData.password);
            Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('회원가입 실패:', error);
            Alert.alert('회원가입 실패', '이메일이 이미 사용중이거나 회원가입에 실패했습니다.');
        }
    }

    return (
        <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>회원가입</Text>
            <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
                placeholder="이름"
                value={formData.name}
                onChangeText={text => handleChange('name', text)}
            />
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
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            <Button title="회원가입" onPress={handleSignup} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    darkContainer: {
        backgroundColor: '#000000',
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
    lightText: {
        color: '#000000',
    },
    darkText: {
      color: '#ffffff',
    },
    lightInput: {
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    darkInput: {
        backgroundColor: '#000000',
        color: '#ffffff',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});