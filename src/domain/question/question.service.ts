import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from './question.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';

@Injectable()
export class QuestionService {
  private readonly REQUIRED_QUESTIONS = [
    { question: 'Público-alvo' },
    { question: 'Quantidade de estrelas' },
    { question: 'E-mail para contato' },
    { question: 'Avaliação' },
  ];
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  public async getQuestion(questionId: string): Promise<Question> {
    const survey = await this.questionRepository.findOne({
      where: {
        questionId,
      },
    });

    if (!survey) {
      throw new NotFoundException(`Pesquisa ${questionId} não encontrada`);
    }

    return survey;
  }
  @OnEvent('survey.created')
  async createQuestion(surveyId: string): Promise<void> {
    if (await this.alreadyInserted()) {
      return;
    }
    for (const { question } of this.REQUIRED_QUESTIONS) {
      const questionPlainToClass = plainToClass(Question, {
        question,
        surveyId,
      });
      await this.questionRepository.insert(questionPlainToClass);
    }
  }

  private async alreadyInserted(): Promise<boolean> {
    const response = await this.questionRepository.find();

    return this.REQUIRED_QUESTIONS.every((req) =>
      response.some((value) => value.question === req.question),
    );
  }
}
