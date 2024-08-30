import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [EventEmitterModule.forRoot(), DomainModule.register()],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
