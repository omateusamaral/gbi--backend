import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'src/data-source';
import { Question } from './question.model';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('DB_CONNECTION_STRING');
        return {
          ...AppDataSource.options,
          url,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Question]),
  ],
  providers: [QuestionService],
})
export class QuestionModule {}
