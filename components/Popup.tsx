import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-date-picker';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
interface PopupProps {
    title: string;
    inputs: InputField[];
    buttons: PopupButton[];
    onSubmit: () => void;
}

type InputField = TextInputField | SelectInputField | DateInputField;

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

interface DateInputField {
    id: number;
    title: string;
    type: 'date';
    value: Date;
    onChange: React.Dispatch<React.SetStateAction<Date>>;
}

interface PopupButton {
    label: string;
    action: 'close' | 'submit' | string;
    onPress: () => void;
    style?: 'primary' | 'secondary' | 'danger';
}

function Popup({ title, inputs, buttons, onSubmit }: PopupProps) {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

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
                    return (
                        <RNPickerSelect
                            key={input.id}
                            items={input.options.map((option) => ({ label: option, value: option || '' }))}
                            onValueChange={input.onChange}
                            style={{
                                inputIOS: {
                                    fontSize: 16,
                                    paddingVertical: 12,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 4,
                                    color: 'black',
                                    paddingRight: 30, // to ensure the text is never behind the icon
                                },
                                inputAndroid: {
                                    fontSize: 16,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 8,
                                    color: 'black',
                                    paddingRight: 30,
                                },
                            }}
                            useNativeAndroidPickerStyle={false}
                        />
                    );
                } else if (input.type === 'date') {
                    return (
                        <View key={input.id}>
                            <Text>{date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</Text>
                            <DatePicker
                                modal
                                open={open}
                                date={input.value}
                                onConfirm={(date) => {
                                    setDate(date);
                                    setOpen(false);
                                }}
                                onCancel={() => {
                                    setOpen(false);
                                }}
                            />
                            <Button title='Open' onPress={() => setOpen(true)} />
                        </View>
                    );
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
        width: '100%',
        height: '100%',
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
