import { apiRequest } from './apiClient';

export interface User {
  id: string;
  phone: string;
}

interface VerifyOtpResponse {
  message: string;
  token: string;
  user: User;
}

// Step 1: ask the backend to text a one-time code to this phone number.
export function sendOtp(phone: string) {
  return apiRequest<{ message: string }>('/auth/send-otp', { phone });
}

// Step 2: send the code the user entered back to the backend to verify it.
export function verifyOtp(phone: string, code: string) {
  return apiRequest<VerifyOtpResponse>('/auth/verify-otp', { phone, code });
}
