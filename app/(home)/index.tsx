import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import moment from 'moment';
import 'moment/locale/ko';
import { removeItem, getItem } from '@/hooks/useAsyncStorage';
import { logout, getLists, postList } from '@/apis/api';
import Popup from '@/components/Popup';
import { TABLE_HEAD } from '@/constants/table';
interface List {
    id: number;
    title: string;
    body: string;
    user_id: number;
    created_at: string;
    status: string;
}

export default function HomeScreen({ navigation }: { navigation: any }) {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const moment = require('moment');
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const day = moment().day();
    const [weeks, setWeeks] = useState(week);
    const [selectedDate, setSelectedDate] = useState(3);
    const [calendar, setCalendar] = useState([]);
    const [refreshToken, setRefreshToken] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [list, setList] = useState([]);

    const [title1, setTitle1] = useState('');
    const [title2, setTitle2] = useState('');

    // 입력 필드
    const inputFields = [
        {
            id: 1,
            title: '학습 목록 제목',
            type: 'text' as const,
            value: title1,
            onChange: setTitle1,
            placeholder: '제목을 입력하세요',
        },
        {
            id: 2,
            title: '학습 목록 설명',
            type: 'text' as const,
            value: title2,
            onChange: setTitle2,
            placeholder: '설명을 입력하세요',
        },
    ];

    // 버튼
    const buttons = [
        {
            label: '취소',
            onPress: () => setIsPopupOpen(false),
            action: 'cancel',
        },
        {
            label: '학습 목록 추가',
            onPress: () => handlePostList(),
            action: 'submit',
        },
    ];

    useEffect(() => {
        const calendar = [];
        if (day !== 3) {
            if (day < 3) {
                setWeeks([...weeks.slice(7 - 3 + day), ...weeks.slice(0, 3 + day + 1)]);
                console.log(weeks);
            } else if (day > 3) {
                setWeeks([...weeks.slice(day - 3), ...weeks.slice(0, day - 3)]);
            }
        }
    }, [day]);
    useEffect(() => {
        const fetchUser = async () => {
            const storedRefreshToken = await getItem('refreshToken');
            console.log(storedRefreshToken);
            setRefreshToken(storedRefreshToken || '');
            const storedUser = await getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        handleGetList();
        setIsLoading(false);
    }, []);

    const handleClickDate = (index: number) => {
        setSelectedDate(index);
    };

    const handleLogout = async (user: any) => {
        try {
            const user_id = parseInt(user.id);
            const response = await logout(user_id);
            await removeItem('accessToken');
            await removeItem('refreshToken');
            await removeItem('user');
            navigation.navigate('(login)');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    const handleGetList = async () => {
        try {
            const response = await getLists();
            console.log(response);
            setList(response);
        } catch (error) {
            console.error('Get list failed:', error);
        }
    };

    const handlePostList = async () => {
        try {
            const response = await postList(title1, title2);
            console.log(response);
            setIsPopupOpen(false);
            handleGetList();
        } catch (error) {
            console.error('Add list failed:', error);
        }
    };
    return (
        <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>홈</Text>
            <Text style={[styles.logoutText, colorScheme === 'dark' && styles.darkLogoutText]} onPress={() => handleLogout(user)}>
                로그아웃
            </Text>
            <View style={styles.weekContainer}>
                {weeks.map((week, index) =>
                    index === selectedDate ? (
                        <Text key={index} style={[styles.toDayText, colorScheme === 'dark' && styles.darkToDayText]}>
                            {week}
                        </Text>
                    ) : (
                        <Text key={index} style={[styles.weekText, colorScheme === 'dark' && styles.darkWeekText]} onPress={() => handleClickDate(index)}>
                            {week}
                        </Text>
                    )
                )}
            </View>
            <View style={styles.listContainer}>
                <View style={styles.addListButton}>
                    <TouchableOpacity style={styles.button} onPress={() => setIsPopupOpen(true)}>
                        <Text style={styles.buttonText}>학습 목록 추가</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tableContainer}>
                    <View style={styles.tableHead}>
                        {TABLE_HEAD.map((head) => (
                            <Text key={head} style={styles.tableHeadText}>
                                {head}
                            </Text>
                        ))}
                    </View>
                </View>
                {list.length > 0 ? (
                    list.map((item: List) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>{item.id}</Text>
                            <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>{item.title}</Text>
                            <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>{item.body}</Text>
                            <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>{item.user_id}</Text>
                            <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>{moment(item.created_at).format('YYYY-MM-DD')}</Text>
                            <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>{item.status}</Text>
                            <Button title='학습하기' onPress={() => handleGetList()} />
                        </View>
                    ))
                ) : (
                    <Text style={[styles.listText, colorScheme === 'dark' && styles.darkListText]}>등록된 학습 목록이 없습니다.</Text>
                )}
            </View>
            {isPopupOpen && <Popup title='학습 목록 추가' inputs={inputFields} buttons={buttons} onSubmit={() => handlePostList()} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    darkContainer: {
        backgroundColor: '#000000',
    },
    darkText: {
        color: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        cursor: 'pointer',
    },
    toDayText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: 'red',
        cursor: 'pointer',
    },
    darkWeekText: {
        color: '#ffffff',
        cursor: 'pointer',
    },
    darkToDayText: {
        color: 'blue',
        cursor: 'pointer',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: 'red',
        textAlign: 'right',
    },
    darkLogoutText: {
        color: 'white',
    },
    listContainer: {
        marginTop: 50,
    },
    listText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        alignItems: 'center',
    },
    darkListText: {
        color: '#ffffff',
        textAlign: 'center',
    },
    addListButton: {
        width: '100%',
        alignItems: 'flex-end',
    },
    button: {
        width: '10%',
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    tableContainer: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    tableHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tableHeadText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
