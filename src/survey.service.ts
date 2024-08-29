import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { plainToClass } from 'class-transformer';
import { Survey } from './survey.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetAudience } from './interfaces/TargetAudience';
import { OrderBy } from './interfaces/OrderBy';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';
import * as jsonmergepatch from 'json-merge-patch';
interface PageToken {
  contactEmail?: string;
  surveyId?: string;
}
@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async getSurvey(surveyId: string): Promise<Survey> {
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

  async listSurveys(
    targetAudience: TargetAudience,
    starRating: number,
    orderBy: OrderBy,
    pageSize: number,
    pageToken: string,
  ): Promise<{
    values: Survey[];
    nextPageToken?: string;
  }> {
    pageSize = pageSize || 10;
    if (pageSize < 1 || pageSize > 1000) {
      throw new BadRequestException('Invalid Pagesize');
    }

    const query = this.surveyRepository
      .createQueryBuilder('survey')
      .where('survey.targetAudience = :targetAudience', {
        targetAudience,
      });

    if (pageToken) {
      const decoded = this.decodePageToken(pageToken);

      query.andWhere(
        '(survey.contactEmail > :contactEmail OR (survey.contactEmail = :contactEmail AND survey.surveyId > :surveyId))',
        {
          surveyId: decoded.surveyId,
          contactEmail: decoded.contactEmail,
        },
      );
    }

    if (starRating) {
      query.andWhere('(survey.starRating = :starRating)', {
        starRating,
      });
    }

    const surveys = await query
      .orderBy('survey.contactEmail', orderBy)
      .addOrderBy('survey.surveyId', orderBy)
      .take(pageSize + 1)
      .getMany();

    const nextPageToken =
      surveys.length > pageSize
        ? this.encodePageToken(surveys[surveys.length - 2])
        : null;

    return {
      values: surveys.slice(0, pageSize),
      nextPageToken,
    };
  }

  private decodePageToken(token: string): PageToken {
    try {
      const a = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      console.log(a);
      return a;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  private encodePageToken({ contactEmail, surveyId }: PageToken): string {
    return Buffer.from(JSON.stringify({ contactEmail, surveyId })).toString(
      'base64',
    );
  }
}
