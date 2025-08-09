import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';

import { Referral, ReferralDocument } from './schemas/referral.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class ReferralService {
  private readonly REFERRAL_BONUS = 50; // 50 coins bonus for both referrer and referee

  constructor(
    @InjectModel(Referral.name) private referralModel: Model<ReferralDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private walletService: WalletService,
  ) {}

  async getReferralCode(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      referralCode: user.referralCode,
      totalReferrals: await this.referralModel.countDocuments({ referrer: userId }),
    };
  }

  async applyReferralOnSignup(userId: string, referralCode: string) {
    // Simplified referral application for new signups
    // Find referrer by code
    const referrer = await this.userModel.findOne({ referralCode });
    if (!referrer) {
      throw new BadRequestException('Invalid referral code');
    }

    // Prevent self-referral (though this shouldn't happen during signup)
    if ((referrer._id as string).toString() === userId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    // Check if this referral code was already used by this user
    const existingReferral = await this.referralModel.findOne({
      referee: userId,
    });

    if (existingReferral) {
      throw new ConflictException('User has already used a referral code');
    }

    try {
      // Try to use transactions if available (replica set/sharded environment)
      let session: ClientSession | undefined = undefined;
      try {
        session = await this.referralModel.db.startSession();
        
        await session.withTransaction(async () => {
          // Create referral record
          await this.referralModel.create([{
            code: referralCode,
            referrer: referrer._id,
            referee: userId,
            bonusAmount: this.REFERRAL_BONUS,
          }], { session });

          // Update user's referredBy field
          await this.userModel.findByIdAndUpdate(
            userId,
            { referredBy: referrer._id },
            { session }
          );

          // Add coin bonus to both users' wallets
          await this.walletService.addCoins(
            (referrer._id as string).toString(),
            this.REFERRAL_BONUS,
            'referral',
            { refereeId: userId },
            session
          );

          await this.walletService.addCoins(
            userId,
            this.REFERRAL_BONUS,
            'referral',
            { referrerId: (referrer._id as string).toString() },
            session
          );
        });

        if (session) {
          await session.endSession();
        }
      } catch (transactionError: any) {
        if (session) {
          await session.endSession();
        }
        
        // Fallback to non-transactional approach for standalone MongoDB
        if (transactionError.message?.includes('Transaction numbers are only allowed') || 
            transactionError.message?.includes('replica set')) {
          
          // Execute operations sequentially without transactions
          await this.referralModel.create({
            code: referralCode,
            referrer: referrer._id,
            referee: userId,
            bonusAmount: this.REFERRAL_BONUS,
          });

          await this.userModel.findByIdAndUpdate(
            userId,
            { referredBy: referrer._id }
          );

          await this.walletService.addCoins(
            (referrer._id as string).toString(),
            this.REFERRAL_BONUS,
            'referral',
            { refereeId: userId }
          );

          await this.walletService.addCoins(
            userId,
            this.REFERRAL_BONUS,
            'referral',
            { referrerId: (referrer._id as string).toString() }
          );
        } else {
          throw transactionError;
        }
      }

      return {
        message: 'Referral applied successfully',
        coinsEarned: this.REFERRAL_BONUS,
      };
    } catch (error) {
      throw error;
    }
  }

  async applyReferral(userId: string, referralCode: string) {
    // Validate user exists and hasn't used a referral before
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.referredBy) {
      throw new ConflictException('User has already used a referral code');
    }

    // Find referrer by code
    const referrer = await this.userModel.findOne({ referralCode });
    if (!referrer) {
      throw new BadRequestException('Invalid referral code');
    }

    // Prevent self-referral
    if ((referrer._id as string).toString() === userId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    // Check if this referral code was already used by this user
    const existingReferral = await this.referralModel.findOne({
      referee: userId,
      code: referralCode,
    });

    if (existingReferral) {
      throw new ConflictException('Referral code already used');
    }

    // Start session for atomic transaction
    const session = await this.referralModel.db.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Create referral record
        await this.referralModel.create([{
          code: referralCode,
          referrer: referrer._id,
          referee: userId,
          bonusAmount: this.REFERRAL_BONUS,
        }], { session });

        // Update user's referredBy field
        await this.userModel.findByIdAndUpdate(
          userId,
          { referredBy: referrer._id },
          { session }
        );

        // Add coin bonus to both users' wallets
        await this.walletService.addCoins(
          (referrer._id as string).toString(),
          this.REFERRAL_BONUS,
          'referral',
          { refereeId: userId },
          session
        );

        await this.walletService.addCoins(
          userId,
          this.REFERRAL_BONUS,
          'referral',
          { referrerId: (referrer._id as string).toString() },
          session
        );
      });

      return {
        message: 'Referral applied successfully',
        coinsEarned: this.REFERRAL_BONUS,
      };
    } finally {
      await session.endSession();
    }
  }
}