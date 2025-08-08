// Shared interfaces for inter-service communication
export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  provider: string;
  providerUserId?: string;
  password?: string;
  referralCode?: string;
}

export interface AuthValidationDto {
  token: string;
}

export interface AuthResponseDto {
  valid: boolean;
  user?: UserDto;
  error?: string;
}

export interface ReferralApplicationDto {
  userId: string;
  referralCode: string;
}

export interface ReferralResponseDto {
  success: boolean;
  message: string;
  coinsEarned?: number;
}