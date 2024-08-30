import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { DomainModule } from '../domain.module';

@Module({
  imports: [DomainModule.register()],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
