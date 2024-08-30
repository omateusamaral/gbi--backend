import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyService } from './survey.service';
import { Survey } from './survey.model';
import { NotFoundException } from '@nestjs/common';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as jsonmergepatch from 'json-merge-patch';
import { TargetAudience } from './interfaces/survey.interface';

const mockSurveyRepository = () => ({
  findOne: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
});

const mockEventEmitter = () => ({
  emit: jest.fn(),
});

describe('SurveyService', () => {
  let service: SurveyService;
  let surveyRepository: Repository<Survey>;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useFactory: mockSurveyRepository,
        },
        {
          provide: EventEmitter2,
          useFactory: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    surveyRepository = module.get<Repository<Survey>>(
      getRepositoryToken(Survey),
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('getSurvey', () => {
    it('should return a survey if found', async () => {
      //Arrange
      const mockSurvey = { surveyId: '1', questions: [] } as Survey;
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(mockSurvey);

      //Act
      const result = await service.getSurvey('1');

      //Assert
      expect(result).toEqual(mockSurvey);
    });

    it('should throw NotFoundException if survey is not found', async () => {
      //Arrange
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(null);

      //Act && Assert
      await expect(service.getSurvey('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createSurvey', () => {
    it('should create and return a survey', async () => {
      //Arrange
      const mockSurvey = { surveyId: '1', questions: [] } as Survey;
      const createFieldsDto: SurveyCreateFieldsDto = {
        title: 'Survey Title',
        targetAudience: TargetAudience.ATHLETES,
      };

      jest.spyOn(surveyRepository, 'insert').mockResolvedValue({
        identifiers: [{ surveyId: '1' }],
      } as any);
      jest.spyOn(service, 'getSurvey').mockResolvedValue(mockSurvey);

      //Act
      const result = await service.createSurvey(createFieldsDto);

      //Assert
      expect(result).toEqual(mockSurvey);
      expect(surveyRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createFieldsDto.title,
          questions: [],
        }),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('survey.created', '1');
    });
  });

  describe('patchSurvey', () => {
    it('should update and return the survey', async () => {
      //Arrage
      const mockSurvey = { surveyId: '1', title: 'Old Title' } as Survey;
      const patchFieldsDto: SurveyPatchFieldsDto = { title: 'New Title' };
      const mergedSurvey = { surveyId: '1', title: 'New Title' } as Survey;

      jest.spyOn(service, 'getSurvey').mockResolvedValue(mockSurvey);
      jest.spyOn(jsonmergepatch, 'apply').mockReturnValue(mergedSurvey);
      jest.spyOn(surveyRepository, 'update').mockResolvedValue(null);
      jest.spyOn(service, 'getSurvey').mockResolvedValue(mergedSurvey);

      //Act
      const result = await service.patchSurvey('1', patchFieldsDto);

      //Assert
      expect(result).toEqual(mergedSurvey);
      expect(surveyRepository.update).toHaveBeenCalledWith(
        { surveyId: '1' },
        mergedSurvey,
      );
    });
  });
});
