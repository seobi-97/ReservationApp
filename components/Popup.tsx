import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-date-picker';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    const [pickerModalVisible, setPickerModalVisible] = useState(false);
    const [currentPickerInput, setCurrentPickerInput] = useState<SelectInputField | null>(null);
    const [tempPickerValue, setTempPickerValue] = useState('');

    const handlePickerOpen = (input: SelectInputField) => {
        setCurrentPickerInput(input);
        setTempPickerValue(input.value);
        setPickerModalVisible(true);
    };

    const handlePickerConfirm = () => {
        if (currentPickerInput) {
            currentPickerInput.onChange(tempPickerValue);
        }
        setPickerModalVisible(false);
        setCurrentPickerInput(null);
    };

    const handlePickerCancel = () => {
        setPickerModalVisible(false);
        setCurrentPickerInput(null);
        setTempPickerValue('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {inputs.map((input) => {
                if (input.type === 'text') {
                    return (
                        <View key={input.id} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{input.title}</Text>
                            <TextInput style={styles.input} placeholder={input.placeholder} value={input.value} onChangeText={input.onChange} placeholderTextColor='#989898' />
                        </View>
                    );
                } else if (input.type === 'select' && input.options) {
                    return (
                        <View key={input.id} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{input.title}</Text>
                            {Platform.OS === 'android' ? (
                                <RNPickerSelect
                                    items={input.options.map((option) => ({ label: option, value: option || '' }))}
                                    value={input.value}
                                    onValueChange={(value) => {
                                        input.onChange(value);
                                    }}
                                    placeholder={{ label: '선택하세요', value: null }}
                                    style={pickerSelectStyles}
                                    useNativeAndroidPickerStyle={false}
                                />
                            ) : (
                                <TouchableOpacity style={styles.pickerButton} onPress={() => handlePickerOpen(input)}>
                                    <Text style={[styles.pickerButtonText, !input.value && styles.placeholderText]}>{input.value || '선택하세요'}</Text>
                                    <Text style={styles.arrowText}>▼</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                } else if (input.type === 'date') {
                    return (
                        <View key={input.id} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{input.title}</Text>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>
                                    {input.value.toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })}
                                </Text>
                                {Platform.OS === 'ios' ? (
                                    <DateTimePicker
                                        value={input.value}
                                        mode='date'
                                        display='compact'
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                input.onChange(selectedDate);
                                            }
                                        }}
                                        style={styles.dateTimePicker}
                                    />
                                ) : (
                                    <View>
                                        {open && (
                                            <DateTimePicker
                                                value={input.value}
                                                mode='date'
                                                display='default'
                                                onChange={(event, selectedDate) => {
                                                    setOpen(false);
                                                    if (selectedDate) {
                                                        input.onChange(selectedDate);
                                                    }
                                                }}
                                            />
                                        )}
                                        <Button title='날짜 선택' onPress={() => setOpen(true)} />
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                }
                return null;
            })}

            <View style={styles.buttonContainer}>
                {buttons.map((button) => (
                    <Button key={button.label} title={button.label} onPress={button.onPress} />
                ))}
            </View>

            {/* iOS Picker Modal */}
            <Modal visible={pickerModalVisible} transparent={true} animationType='slide'>
                <View style={styles.modalOverlay}>
                    <View style={styles.pickerModal}>
                        <View style={styles.pickerHeader}>
                            <TouchableOpacity onPress={handlePickerCancel}>
                                <Text style={styles.cancelButton}>취소</Text>
                            </TouchableOpacity>
                            <Text style={styles.pickerTitle}>{currentPickerInput?.title}</Text>
                            <TouchableOpacity onPress={handlePickerConfirm}>
                                <Text style={styles.confirmButton}>확인</Text>
                            </TouchableOpacity>
                        </View>
                        <Picker selectedValue={tempPickerValue} onValueChange={(value) => setTempPickerValue(value)} style={styles.modalPicker}>
                            <Picker.Item label='선택하세요' value='' />
                            {currentPickerInput?.options?.map((option) => (
                                <Picker.Item key={option} label={option} value={option} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </Modal>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
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
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    pickerContainer: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    picker: {
        width: '100%',
        height: '100%',
    },
    pickerItem: {
        fontSize: 16,
        color: 'black',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    dateText: {
        fontSize: 16,
        color: 'black',
    },
    dateTimePicker: {
        width: '100%',
        height: '100%',
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
    },
    pickerButtonText: {
        fontSize: 16,
        color: 'black',
    },
    placeholderText: {
        color: '#989898',
    },
    arrowText: {
        fontSize: 16,
        color: '#989898',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    pickerModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        maxHeight: '70%',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        color: 'red',
        fontSize: 16,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    confirmButton: {
        color: 'blue',
        fontSize: 16,
    },
    modalPicker: {
        width: '100%',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        width: '100%',
        height: 40,
        zIndex: 100,
        backgroundColor: '#939090',
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
});

export default Popup;
