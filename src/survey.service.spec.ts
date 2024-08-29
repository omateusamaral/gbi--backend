import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { Survey } from './survey.model';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageTokenService } from './page-token.service';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { TargetAudience } from './interfaces/survey.interface';
import { seedSurvey } from './seeds/survey.seed';
import { BadRequestException } from '@nestjs/common';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';
import { OrderBy } from './interfaces/order-by';

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
        starRating: 4,
        contactEmail: 'test@example.com',
        targetAudience: TargetAudience.YoungAdults,
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
  describe('listSurveys', () => {
    it('should return a paginated list of surveys', async () => {
      //Arrange
      const targetAudience = TargetAudience.FashionConsciousConsumers;
      const starRating = 4;
      const orderBy = OrderBy.ASC;
      const pageSize = 2;
      const pageToken = '';

      const mockSurveys = [
        { surveyId: '1', contactEmail: 'a@example.com' },
        { surveyId: '2', contactEmail: 'b@example.com' },
      ] as Survey[];

      jest.spyOn(surveyRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockSurveys),
      } as unknown as SelectQueryBuilder<Survey>);

      //Act
      const result = await service.listSurveys(
        targetAudience,
        starRating,
        orderBy,
        pageSize,
        pageToken,
      );

      //Arrange
      expect(result.values).toEqual(mockSurveys.slice(0, pageSize));
      expect(result.nextPageToken).toBeNull();
    });

    it('should throw BadRequestException if pageSize is invalid', async () => {
      await expect(
        service.listSurveys(
          TargetAudience.OccasionShoppers,
          4,
          OrderBy.ASC,
          -1,
          '',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('listAllSurveysWithoutFilters', () => {
    it('should return all surveys without filters', async () => {
      //Arrange

      jest
        .spyOn(surveyRepository, 'find')
        .mockResolvedValue(seedSurvey as unknown as Survey[]);

      //Act
      const result = await service.listAllSurveysWithoutFilters();

      //Arrange
      expect(result).toEqual(seedSurvey);
      expect(surveyRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
