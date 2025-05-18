import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EventsModule } from './cels/cel.module';
import { RewardsModule } from './rewards/rewards.module';
import { RewardRequestsModule } from './reward-requests/reward-requests.module';
import { JwtStrategy } from '../../../common/strategies/jwt.strategy';
import { RewardConditionModule } from './reward-condition/reward-condition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/event/.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    EventsModule,
    RewardsModule,
    RewardRequestsModule,
    RewardConditionModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
