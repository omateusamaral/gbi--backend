import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'src/data-source';
import { Question } from 'src/question/question.model';
import { Survey } from './survey.model';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
    TypeOrmModule.forFeature([Survey, Question, Response]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
