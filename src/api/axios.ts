import axios, { InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
	baseURL: '/api',
});

axiosInstance.interceptors.request.use(authRequestInterceptor);

function authRequestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	if (!config.withCredentials) {
		return config;
	}

	const tokenJSON = window.localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_APP_CODE!}-auth-token`)!;
	const token = JSON.parse(tokenJSON)?.access_token;

	config.headers.set('Authorization', `Bearer ${token}`);

	return config;
}

export default axiosInstance;
