import { Injectable } from '@nestjs/common';
import { Question } from './question.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';

@Injectable()
export class QuestionService {
  private readonly requiredQuestions = [
    { question: 'Público-alvo' },
    { question: 'Quantidade de estrelas' },
    { question: 'E-mail para contato' },
  ];
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  @OnEvent('survey.created')
  async createQuestion(surveyId: string): Promise<void> {
    if (await this.alreadyInserted()) {
      return;
    }
    for (const { question } of this.requiredQuestions) {
      const questionPlainToClass = plainToClass(Question, {
        question,
        surveyId,
      });
      await this.questionRepository.insert(questionPlainToClass);
    }
  }

  private async alreadyInserted(): Promise<boolean> {
    const response = await this.questionRepository.find();

    console.log(this.requiredQuestions);

    return this.requiredQuestions.every((req) =>
      response.some((value) => value.question === req.question),
    );
  }
}
