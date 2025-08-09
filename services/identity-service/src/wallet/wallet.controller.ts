import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { WalletService } from './wallet.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import {
  WalletBalanceResponseDto,
  MoneyBalanceResponseDto,
  CoinBalanceResponseDto,
} from './dto';
import { WalletBalance, TransactionHistoryResponse } from './interfaces/wallet.interface';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance (both money and coins)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Wallet balance retrieved',
    type: WalletBalanceResponseDto
  })
  async getBalance(@User('sub') userId: string): Promise<WalletBalance> {
    return this.walletService.getBalance(userId);
  }

  @Get('balance/money')
  @ApiOperation({ summary: 'Get money balance only' })
  @ApiResponse({ status: 200, description: 'Money balance retrieved', type: MoneyBalanceResponseDto })
  async getMoneyBalance(@User('sub') userId: string): Promise<MoneyBalanceResponseDto> {
    const balance = await this.walletService.getMoneyBalance(userId);
    return { money: balance, userId };
  }

  @Get('balance/coins')
  @ApiOperation({ summary: 'Get coin balance only' })
  @ApiResponse({ status: 200, description: 'Coin balance retrieved', type: CoinBalanceResponseDto })
  async getCoinBalance(@User('sub') userId: string): Promise<CoinBalanceResponseDto> {
    const balance = await this.walletService.getCoinBalance(userId);
    return { coins: balance, userId };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['credit', 'debit'] })
  @ApiQuery({ name: 'currency', required: false, enum: ['money', 'coins'] })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction history retrieved'
  })
  async getTransactions(
    @User('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('type') type?: 'credit' | 'debit',
    @Query('currency') currency?: 'money' | 'coins',
  ): Promise<TransactionHistoryResponse> {
    return this.walletService.getTransactions(userId, { page, limit, type, currency });
  }

  @Get('transactions/money')
  @ApiOperation({ summary: 'Get money transaction history only' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['credit', 'debit'] })
  @ApiResponse({ status: 200, description: 'Money transaction history retrieved' })
  async getMoneyTransactions(
    @User('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('type') type?: 'credit' | 'debit',
  ): Promise<TransactionHistoryResponse> {
    return this.walletService.getTransactions(userId, { page, limit, type, currency: 'money' });
  }

  @Get('transactions/coins')
  @ApiOperation({ summary: 'Get coin transaction history only' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['credit', 'debit'] })
  @ApiResponse({ status: 200, description: 'Coin transaction history retrieved' })
  async getCoinTransactions(
    @User('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('type') type?: 'credit' | 'debit',
  ): Promise<TransactionHistoryResponse> {
    return this.walletService.getTransactions(userId, { page, limit, type, currency: 'coins' });
  }
}