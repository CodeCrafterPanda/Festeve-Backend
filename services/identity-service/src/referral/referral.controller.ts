import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ReferralService } from './referral.service';
import { ApplyReferralDto } from './dto/apply-referral.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';

@ApiTags('Referral')
@Controller('referral')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('code')
  @ApiOperation({ summary: 'Get user referral code' })
  @ApiResponse({ status: 200, description: 'Referral code retrieved' })
  async getReferralCode(@User('sub') userId: string) {
    return this.referralService.getReferralCode(userId);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply referral code' })
  @ApiResponse({ status: 200, description: 'Referral applied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid referral code or already used' })
  async applyReferral(
    @User('sub') userId: string,
    @Body() applyReferralDto: ApplyReferralDto,
  ) {
    return this.referralService.applyReferral(userId, applyReferralDto.code);
  }
}