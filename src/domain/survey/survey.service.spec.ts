import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './survey.model';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageTokenService } from '../response/page-token.service';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { TargetAudience } from './interfaces/survey.interface';
import { seedSurvey } from './seeds/survey.seed';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';

describe('SurveyService', () => {
  let service: SurveyService;
  let surveyRepository: Repository<Survey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useClass: Repository,
        },
        {
          provide: PageTokenService,
          useValue: {
            encodePageToken: jest.fn(),
            decodePageToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    surveyRepository = module.get<Repository<Survey>>(
      getRepositoryToken(Survey),
    );
  });

  describe('createSurvey', () => {
    it('should create a new survey and return it', async () => {
      //Arrange
      const surveyCreateFields: SurveyCreateFieldsDto = {
        title: 'New Survey',
        targetAudience: TargetAudience.ATHLETES,
      };

      jest.spyOn(surveyRepository, 'insert').mockResolvedValue({
        identifiers: [{ ...seedSurvey[0], surveyId: '1' }],
      } as any);

      jest
        .spyOn(surveyRepository, 'findOneBy')
        .mockResolvedValue({ ...seedSurvey[0], surveyId: '1' } as Survey);

      //Act

      const response = await service.createSurvey(surveyCreateFields);

      //Assert

      expect(response).toEqual({
        ...seedSurvey[0],
        surveyId: '1',
      });
    });
  });

  describe('patchSurvey', () => {
    it('should update an existing survey and return it', async () => {
      //Arrange
      const surveyPatchFields: SurveyPatchFieldsDto = {
        ...seedSurvey[0],
        title: 'Updated Survey',
      };

      jest
        .spyOn(surveyRepository, 'findOneBy')
        .mockResolvedValue(seedSurvey[0] as unknown as Survey);

      jest.spyOn(surveyRepository, 'update').mockResolvedValue(undefined);

      const result = await service.patchSurvey(
        seedSurvey[0].surveyId,
        surveyPatchFields,
      );
      expect(result).toEqual({
        ...seedSurvey[0],
        title: 'Updated Survey',
      });
    });
  });
});
