import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: '/api',
	headers: {
		Authorization: `Bearer ${getAuthToken()}`
	}
});

function getAuthToken(): string {
	const tokenJSON = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_APP_CODE!}-auth-token`)!;
	const token = JSON.parse(tokenJSON).access_token;
	return token;
}
