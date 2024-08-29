import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { toCsv } from '@iwsio/json-csv-node';
import { DateTime } from 'luxon';

@Injectable()
export class ExportToCSVService {
  constructor(private readonly surveyService: SurveyService) {}

  public async exportCSV() {
    try {
      const data = await this.surveyService.listAllSurveysWithoutFilters();
      return await toCsv(data, {
        fields: [
          {
            name: 'surveyId',

            label: 'Identificação',
          },

          {
            name: 'title',

            label: 'Título',
          },
          {
            name: 'starRating',

            label: 'Avaliação',
          },
          {
            name: 'contactEmail',

            label: 'E-mail',
          },

          {
            name: 'createdAt',

            label: 'Criado em',
            transform: (value: string) => this.formatToBrazilianDate(value),
          },
          {
            name: 'updatedAt',

            label: 'Atualizado At',
            transform: (value: string) => this.formatToBrazilianDate(value),
          },
        ],

        fieldSeparator: ',',
        ignoreHeader: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnprocessableEntityException('Could not process to export CSV');
    }
  }

  private formatToBrazilianDate(value: string) {
    return DateTime.fromJSDate(new Date(value))
      .setLocale('pt-BR')
      .toFormat('dd/MM/yyyy HH:mm');
  }
}
