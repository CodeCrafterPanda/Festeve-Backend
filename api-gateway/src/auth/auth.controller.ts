import { Controller, Post, Body, Inject, Get, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';

// Import DTOs from original modules (you may need to copy these or create shared package)
interface SignupDto {
  name: string;
  email: string;
  phone?: string;
  provider: string;
  providerUserId: string;
  password?: string;
  profilePicture?: string;
  referralCode?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface VerifyOtpDto {
  identifier: string;
  code: string;
  signupData?: SignupDto;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IDENTITY_CLIENT') private readonly identityClient: ClientProxy,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  signup(@Body() signupDto: SignupDto): Observable<any> {
    return this.identityClient.send('auth_signup', signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto): Observable<any> {
    return this.identityClient.send('auth_login', loginDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Observable<any> {
    return this.identityClient.send('auth_verify_otp', verifyOtpDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() request: any): Observable<any> {
    const token = request.headers.authorization?.replace('Bearer ', '');
    return this.identityClient.send('auth_logout', { token });
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() request: any): Observable<any> {
    const token = request.headers.authorization?.replace('Bearer ', '');
    return this.identityClient.send('auth_profile', { token });
  }
}
