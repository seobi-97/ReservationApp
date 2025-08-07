import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import moment from "moment";
import "moment/locale/ko";
import { removeItem, getItem } from "@/hooks/useAsyncStorage";
import {
  logout,
  getClasses,
  getClassesByDate,
  createClass,
  reserveClass,
} from "@/apis/api";
import Popup from "@/components/Popup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { TABLE_HEAD } from "@/constants/table";
interface List {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  creator_name: string;
  created_at: string;
  start_date: string;
  status: string;
  participants: object[];
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const moment = require("moment");
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const [currentWeek, setCurrentWeek] = useState(moment());
  console.log(currentWeek);
  const [selectedDate, setSelectedDate] = useState(moment().day());
  const [refreshToken, setRefreshToken] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [list, setList] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStartDate] = useState(new Date());
  const [capacity, setCapacity] = useState("1");

  // 입력 필드
  const inputFields = [
    {
      id: 1,
      title: "학습 목록 제목",
      type: "text" as const,
      value: title,
      onChange: setTitle,
      placeholder: "제목을 입력하세요",
    },
    {
      id: 2,
      title: "학습 목록 설명",
      type: "text" as const,
      value: description,
      onChange: setDescription,
      placeholder: "설명을 입력하세요",
    },
    {
      id: 3,
      title: "학습 목록 시작 날짜 및 시간",
      type: "datetime" as const,
      value: start_date,
      onChange: setStartDate,
    },
    {
      id: 4,
      title: "학습 목록 최대 인원",
      type: "select" as const,
      value: capacity,
      onChange: setCapacity,
      options: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    },
  ];

  // 버튼
  const buttons = [
    {
      label: "취소",
      onPress: () => setIsPopupOpen(false),
      action: "cancel",
    },
    {
      label: "학습 목록 추가",
      onPress: () => handleCreateClass(),
      action: "submit",
    },
  ];

  // 선택한 요일을 기준으로 주의 날짜들을 생성하는 함수
  const getWeekDates = (
    weekMoment: moment.Moment,
    selectedDayOfWeek?: number
  ) => {
    if (selectedDayOfWeek !== undefined) {
      // 선택한 요일을 기준으로 주 재정렬
      const targetDate = weekMoment.clone().day(selectedDayOfWeek);
      console.log("targetDate", targetDate);
      console.log("selectedDayOfWeek", selectedDayOfWeek);
      const startOfWeek = targetDate.clone().subtract(3, "days"); // 선택한 날짜를 가운데로
      const dates = [];

      for (let i = 0; i < 7; i++) {
        dates.push(startOfWeek.clone().add(i, "days"));
      }
      return dates;
    } else {
      // 기본 주 표시
      const startOfWeek = weekMoment.clone().startOf("week");
      const dates = [];

      for (let i = 0; i < 7; i++) {
        dates.push(startOfWeek.clone().add(i, "days"));
      }

      return dates;
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const storedRefreshToken = await getItem("refreshToken");
      console.log(storedRefreshToken);
      setRefreshToken(storedRefreshToken || "");
      const storedUser = await getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // 초기 로드 시 선택된 날짜의 수업 가져오기
    const loadInitialClasses = async () => {
      try {
        const weekDates = getWeekDates(currentWeek, selectedDate);
        const centerDate = weekDates[3]; // 가운데 날짜
        const selectedDateStr = centerDate.format("YYYY-MM-DD");
        const response = await getClassesByDate(selectedDateStr);
        setList(response.data);
      } catch (error) {
        console.error("Get initial classes failed:", error);
        // 에러 시 전체 리스트로 폴백
        handleGetClasses();
      }
    };

    loadInitialClasses();
    setIsLoading(false);
  }, []);

  const handleClickDate = async (clickedDate: moment.Moment) => {
    const targetDate = clickedDate.clone();
    const dayOfWeek = clickedDate.day();
    setSelectedDate(dayOfWeek);
    // 현재 클릭한 날짜가 가운데인 주를 생성
    const currentWeekDates = getWeekDates(targetDate, dayOfWeek);
    const centerDate = currentWeekDates[3]; // 가운데 날짜 (인덱스 3)

    // 해당 날짜가 포함된 주의 시작으로 설정
    setCurrentWeek(centerDate);

    // 선택한 날짜의 수업 데이터 가져오기
    setIsDataLoading(true);
    try {
      const selectedDate = centerDate.format("YYYY-MM-DD");
      const response = await getClassesByDate(selectedDate);
      setList(response.data);
    } catch (error) {
      console.error("Get classes by date failed:", error);
      // 에러 시 전체 리스트로 폴백
      handleGetClasses();
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleLogout = async (user: any) => {
    try {
      const user_id = parseInt(user.id);
      const response = await logout(user_id);
      if (response.status === 200) {
        await removeItem("accessToken");
        await removeItem("refreshToken");
        await removeItem("user");
        console.log("로그아웃 성공");
        navigation.navigate("(login)");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleGetClasses = async () => {
    setIsDataLoading(true);
    try {
      const response = await getClasses();
      setList(response.data);
    } catch (error) {
      console.error("Get list failed:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleCreateClass = async () => {
    try {
      // UTC로 변환하여 서버에 전송
      const response = await createClass(
        title,
        user.id,
        start_date.toISOString(), // UTC로 전송
        description,
        "active",
        parseInt(capacity)
      );
      console.log(response.data);
      setIsPopupOpen(false);
      handleGetClasses();
    } catch (error) {
      console.error("Add list failed:", error);
    }
  };

  const handleReserveClass = async (class_id: number, user_id: number) => {
    try {
      const response = await reserveClass(class_id, user_id);
      console.log(response.data);
    } catch (error) {
      console.error("Reserve class failed:", error);
    }
  };

  return (
    <>
      <LoadingSpinner
        visible={isDataLoading}
        text="수업 목록을 불러오는 중..."
      />
      {isPopupOpen ? (
        <Popup
          title="학습 목록 추가"
          inputs={inputFields}
          buttons={buttons}
          onSubmit={() => handleCreateClass()}
        />
      ) : (
        <View
          style={[
            styles.container,
            colorScheme === "dark" && styles.darkContainer,
          ]}
        >
          <Text
            style={[styles.title, colorScheme === "dark" && styles.darkText]}
          >
            홈
          </Text>
          <Text
            style={[
              styles.logoutText,
              colorScheme === "dark" && styles.darkLogoutText,
            ]}
            onPress={() => handleLogout(user)}
          >
            로그아웃
          </Text>
          <View style={styles.calendarContainer}>
            {/* 주 이동 버튼 */}
            <View style={styles.weekNavigation}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={async () => {
                  const newWeek = currentWeek.clone().subtract(1, "week");
                  setCurrentWeek(newWeek);

                  // 선택된 날짜의 수업 데이터 가져오기
                  setIsDataLoading(true);
                  try {
                    const weekDates = getWeekDates(newWeek, selectedDate);
                    const centerDate = weekDates[3]; // 가운데 날짜
                    const selectedDateStr = centerDate.format("YYYY-MM-DD");
                    const response = await getClassesByDate(selectedDateStr);
                    setList(response.data);
                  } catch (error) {
                    console.error("Get classes by date failed:", error);
                    handleGetClasses();
                  } finally {
                    setIsDataLoading(false);
                  }
                }}
              >
                <Text style={styles.navButtonText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.weekTitle}>
                {currentWeek.format("YYYY년 M월")}
              </Text>
              <TouchableOpacity
                style={styles.navButton}
                onPress={async () => {
                  const newWeek = currentWeek.clone().add(1, "week");
                  setCurrentWeek(newWeek);

                  // 선택된 날짜의 수업 데이터 가져오기
                  setIsDataLoading(true);
                  try {
                    const weekDates = getWeekDates(newWeek, selectedDate);
                    const centerDate = weekDates[3]; // 가운데 날짜
                    const selectedDateStr = centerDate.format("YYYY-MM-DD");
                    const response = await getClassesByDate(selectedDateStr);
                    setList(response.data);
                  } catch (error) {
                    console.error("Get classes by date failed:", error);
                    handleGetClasses();
                  } finally {
                    setIsDataLoading(false);
                  }
                }}
              >
                <Text style={styles.navButtonText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* 요일 헤더 */}
            <View style={styles.weekHeader}>
              {getWeekDates(currentWeek, selectedDate).map((date, index) => (
                <Text key={index} style={styles.weekHeaderText}>
                  {week[date.day()]}
                </Text>
              ))}
            </View>

            {/* 날짜 그리드 */}
            <View style={styles.dateGrid}>
              {getWeekDates(currentWeek, selectedDate).map((date, index) => {
                const isToday = date.isSame(moment(), "day");
                const isSelected = date.day() === selectedDate;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCell,
                      isToday && styles.todayCell,
                      isSelected && styles.selectedCell,
                    ]}
                    onPress={() => handleClickDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        isToday && styles.todayText,
                        isSelected && styles.selectedText,
                        colorScheme === "dark" && styles.darkDateText,
                      ]}
                    >
                      {date.format("D")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.addListButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsPopupOpen(true)}
              >
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
              list.map((item: List, index: number) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {item.description}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {item.creator_name}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {moment(item.start_date).format("YYYY-MM-DD HH:mm")}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {item.status}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      colorScheme === "dark" && styles.darkListText,
                    ]}
                  >
                    {item.participants.length}
                  </Text>
                  <View style={styles.buttonCell}>
                    <Button
                      title="학습하기"
                      onPress={() => handleReserveClass(item.id, user.id)}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyList}>
                <Text
                  style={[
                    styles.listText,
                    colorScheme === "dark" && styles.darkListText,
                  ]}
                >
                  등록된 학습 목록이 없습니다.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  darkText: {
    color: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  calendarContainer: {
    marginVertical: 20,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  dateGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dateCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  todayCell: {
    backgroundColor: "#007BFF",
  },
  selectedCell: {
    backgroundColor: "#28a745",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  todayText: {
    color: "white",
  },
  selectedText: {
    color: "white",
  },
  darkDateText: {
    color: "#ffffff",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "red",
    textAlign: "right",
  },
  darkLogoutText: {
    color: "white",
  },
  listContainer: {
    marginTop: 50,
  },
  listText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    alignItems: "center",
  },
  darkListText: {
    color: "#ffffff",
    textAlign: "center",
  },
  addListButton: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  tableContainer: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    borderRadius: 5,
  },
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  tableHeadText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  buttonCell: {
    flex: 1,
    alignItems: "center",
  },
  emptyList: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
