import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurohitsController } from './purohits.controller';
import { PurohitsService } from './purohits.service';
import { Purohit, PurohitSchema } from './schemas/purohit.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purohit.name, schema: PurohitSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PurohitsController],
  providers: [PurohitsService],
  exports: [PurohitsService],
})
export class PurohitsModule {}