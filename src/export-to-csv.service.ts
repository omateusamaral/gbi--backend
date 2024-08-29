import { Injectable } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { toCsv } from '@iwsio/json-csv-node';
@Injectable()
export class ExportToCSVService {
  constructor(private readonly surveyService: SurveyService) {}

  public async exportCSV() {
    const data = await this.surveyService.listAllSurveysWithoutFilters();
    try {
      return await toCsv(data, {
        fields: [
          {
            name: 'surveyId',

            label: 'SurveyId',
          },

          {
            name: 'title',

            label: 'Title',
          },
        ],

        fieldSeparator: ',',
        ignoreHeader: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Could not process CSV';
    }
  }
}
