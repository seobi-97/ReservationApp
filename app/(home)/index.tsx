import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import moment from 'moment';
import 'moment/locale/ko';
export default function HomeScreen({ navigation }: { navigation: any }) {
    const colorScheme = useColorScheme();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const moment = require('moment');
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const day = moment().day();
    const [weeks, setWeeks] = useState(week);
    const [selectedDate, setSelectedDate] = useState(moment().format('dddd'));
    const [calendar, setCalendar] = useState([]);

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
    console.log(weeks);
    return (
        <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' && styles.darkText]}>홈</Text>
            <Text style={[styles.logoutText, colorScheme === 'dark' && styles.darkLogoutText]}>로그아웃</Text>
            <View style={styles.weekContainer}>
                {weeks.map((week, index) =>
                    index === 3 ? (
                        <Text key={index} style={[styles.toDayText, colorScheme === 'dark' && styles.darkToDayText]}>
                            {week}
                        </Text>
                    ) : (
                        <Text key={index} style={[styles.weekText, colorScheme === 'dark' && styles.darkWeekText]}>
                            {week}
                        </Text>
                    )
                )}
            </View>
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
    },
    toDayText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: 'red',
    },
    darkWeekText: {
        color: '#ffffff',
    },
    darkToDayText: {
        color: 'blue',
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
});
