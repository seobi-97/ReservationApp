import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface PopupProps {
    title: string;
    inputs: InputField[];
    buttons: PopupButton[];
    onSubmit: () => void;
}

type InputField = TextInputField | SelectInputField;

interface TextInputField {
    id: number;
    title: string;
    placeholder?: string;
    type: 'text' | 'password';
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
}

interface SelectInputField {
    id: number;
    title: string;
    type: 'select';
    options?: string[];
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
}

interface PopupButton {
    label: string;
    action: 'close' | 'submit' | string;
    onPress: () => void;
    style?: 'primary' | 'secondary' | 'danger';
}

function Popup({ title, inputs, buttons, onSubmit }: PopupProps) {
    return (
        <View style={styles.container}>
            <Text>{title}</Text>
            {inputs.map((input) => {
                if (input.type === 'text') {
                    return (
                        <TextInput
                            key={input.id}
                            style={styles.input}
                            placeholder={input.placeholder}
                            value={input.value}
                            onChangeText={input.onChange}
                            placeholderTextColor='#989898'
                        />
                    );
                } else if (input.type === 'select' && input.options) {
                    return <RNPickerSelect key={input.id} items={input.options.map((option) => ({ label: option, value: option }))} onValueChange={input.onChange} />;
                }
            })}
            <View style={styles.buttonContainer}>
                {buttons.map((button) => (
                    <Button key={button.label} title={button.label} onPress={button.onPress} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '30%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
});

export default Popup;
