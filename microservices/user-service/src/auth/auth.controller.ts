import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { USER_PATTERNS } from '../../../shared/constants/message-patterns';
import {
  AuthValidationDto,
  AuthResponseDto,
  CreateUserDto,
  UserDto,
} from '../../../shared/interfaces/user.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(USER_PATTERNS.VALIDATE_TOKEN)
  async validateToken(@Payload() data: AuthValidationDto): Promise<AuthResponseDto> {
    try {
      const user = await this.authService.validateToken(data.token);
      return {
        valid: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
        },
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid token',
      };
    }
  }

  @MessagePattern(USER_PATTERNS.CREATE_USER)
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.authService.createUser(createUserDto);
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };
  }

  @MessagePattern(USER_PATTERNS.GET_USER)
  async getUser(@Payload() userId: string): Promise<UserDto | null> {
    try {
      const user = await this.authService.getUserById(userId);
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      };
    } catch (error) {
      return null;
    }
  }
}