import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from './response.model';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ResponseCreateFieldsDto } from './dtos/response-create-fields.dto';
import { SurveyService } from '../survey';
import { QuestionService } from '../question/question.service';
import { TargetAudience } from '../survey/interfaces/survey.interface';
import { OrderBy } from './interfaces/response.interface';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    private readonly surveyService: SurveyService,
    private readonly questionService: QuestionService,
  ) {}

  private async getResponse(responseId: string): Promise<Response> {
    const response = await this.responseRepository.findOne({
      where: {
        responseId,
      },
      relations: ['questionId', 'surveyId'],
    });

    if (!response) {
      throw new NotFoundException(`Resposta ${responseId} não encontrada`);
    }

    return response;
  }

  async createResponse(
    surveyId: string,
    responseCreateFields: ResponseCreateFieldsDto,
  ): Promise<Response> {
    await Promise.all([
      this.surveyService.getSurvey(surveyId),
      this.questionService.getQuestion(responseCreateFields.questionId),
    ]);

    const responsePlainToClass = plainToClass(Response, {
      ...responseCreateFields,
      surveyId,
    });

    const response = await this.responseRepository.insert(responsePlainToClass);

    return await this.getResponse(response.identifiers[0].responseId);
  }

  async listResponse(
    targetAudience: TargetAudience,
    orderBy: OrderBy,
  ): Promise<Response[]> {
    return await this.responseRepository
      .createQueryBuilder('response')
      .leftJoinAndSelect('response.questionId', 'question')
      .leftJoinAndSelect('response.surveyId', 'survey')
      .where('survey.targetAudience = :targetAudience', { targetAudience })
      .orderBy('survey.starRating', orderBy)
      .distinct(true)
      .getMany();
  }

  async countRatingForSurvey(surveyId: string): Promise<number> {
    return await this.responseRepository.count({
      where: {
        survey: {
          surveyId,
        },
      },
    });
  }
}
