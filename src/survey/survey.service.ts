import { Injectable, NotFoundException } from '@nestjs/common';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { plainToClass } from 'class-transformer';
import { Survey } from './survey.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';
import * as jsonmergepatch from 'json-merge-patch';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  private async getSurvey(surveyId: string): Promise<Survey> {
    const survey = await this.surveyRepository.findOneBy({
      surveyId,
    });

    if (!survey) {
      throw new NotFoundException(`Pesquisa ${surveyId} não encontrada`);
    }

    return survey;
  }

  async createSurvey(
    surveyCreateFields: SurveyCreateFieldsDto,
  ): Promise<Survey> {
    const surveyPlainToClass = plainToClass(Survey, surveyCreateFields);

    const survey = await this.surveyRepository.insert(surveyPlainToClass);

    return await this.getSurvey(survey.identifiers[0].surveyId);
  }

  async patchSurvey(
    surveyId: string,
    surveyPatchFields: SurveyPatchFieldsDto,
  ): Promise<Survey> {
    const surveyToUpdate = await this.getSurvey(surveyId);
    const surveyPlainToClass = plainToClass(Survey, { ...surveyPatchFields });

    const survey = plainToClass(
      Survey,
      jsonmergepatch.apply(surveyToUpdate, surveyPlainToClass),
    );
    await this.surveyRepository.update(
      {
        surveyId: surveyId,
      },
      survey,
    );

    return survey;
  }
}
