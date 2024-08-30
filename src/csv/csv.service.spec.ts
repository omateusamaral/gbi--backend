import { Test, TestingModule } from '@nestjs/testing';
import { CSVService } from './csv.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { toCsv } from '@iwsio/json-csv-node';
import { SurveyService } from 'src/domain';

jest.mock('@iwsio/json-csv-node');

describe('ExportCSVService', () => {
  let service: CSVService;
  let surveyService: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CSVService,
        {
          provide: SurveyService,
          useValue: {
            listAllSurveysWithoutFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CSVService>(CSVService);
    surveyService = module.get<SurveyService>(SurveyService);
  });

  it('should export CSV with correct data', async () => {
    //Arrange
    const mockData = [
      {
        surveyId: '1',
        title: 'Survey 1',
        starRating: 5,
        contactEmail: 'test@example.com',
        createdAt: '2024-08-29T12:00:00Z',
        updatedAt: '2024-08-29T13:00:00Z',
      },
    ];
    const mockCsv =
      'Identificação,Título,Avaliação,E-mail,Criado em,Atualizado At\n1,Survey 1,5,test@example.com,29/08/2024 09:00,29/08/2024 10:00\n';

    (surveyService.listAllSurveysWithoutFilters as jest.Mock).mockResolvedValue(
      mockData,
    );
    (toCsv as jest.Mock).mockResolvedValue(mockCsv);

    //Act
    const result = await service.export();

    //Assert
    expect(result).toBe(mockCsv);
    expect(surveyService.listAllSurveysWithoutFilters).toHaveBeenCalledTimes(1);
    expect(toCsv).toHaveBeenCalledWith(mockData, {
      fields: [
        { name: 'surveyId', label: 'Identificação' },
        { name: 'title', label: 'Título' },
        { name: 'starRating', label: 'Avaliação' },
        { name: 'contactEmail', label: 'E-mail' },
        {
          name: 'createdAt',
          label: 'Criado em',
          transform: expect.any(Function),
        },
        {
          name: 'updatedAt',
          label: 'Atualizado At',
          transform: expect.any(Function),
        },
      ],
      fieldSeparator: ',',
      ignoreHeader: false,
    });
  });

  it('should throw an UnprocessableEntityException if an error occurs', async () => {
    //Arrange
    (surveyService.listAllSurveysWithoutFilters as jest.Mock).mockRejectedValue(
      new Error(),
    );

    //Act && Assert
    await expect(service.export()).rejects.toThrow(
      UnprocessableEntityException,
    );
  });
});
