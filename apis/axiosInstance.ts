import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.0.124:5500";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      console.log("refreshToken:: ", refreshToken);
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    } catch (error) {
      console.error("토큰 가져오기 실패:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error:: ", error);
    const originalRequest = error.config;

    // 토큰 갱신 요청이거나 로그인 요청인 경우 인터셉터 제외
    if (
      originalRequest.url?.includes("/auth/token") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup")
    ) {
      return Promise.reject(error);
    }

    // 401 에러이고 재시도하지 않은 경우에만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        console.log("리프레시 토큰:", refreshToken);

        if (refreshToken) {
          // 토큰 갱신 요청 시 인터셉터 제외를 위한 플래그 추가
          const refreshResponse = await axios.post(
            `${API_URL}/auth/token`,
            {
              refreshToken: refreshToken,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("토큰 갱신 성공:", refreshResponse.data);

          // 새로운 토큰 저장
          await AsyncStorage.setItem(
            "accessToken",
            refreshResponse.data.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            refreshResponse.data.refreshToken
          );

          // 원래 요청에 새로운 토큰 설정
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          console.log("리프레시 토큰이 없음");
          // 리프레시 토큰이 없으면 로그아웃 처리
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("refreshToken");
          await AsyncStorage.removeItem("user");
          return Promise.reject(new Error("No refresh token available"));
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        // await AsyncStorage.removeItem('accessToken');
        // await AsyncStorage.removeItem('refreshToken');
        // await AsyncStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
