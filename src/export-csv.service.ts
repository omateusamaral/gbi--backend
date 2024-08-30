import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { toCsv } from '@iwsio/json-csv-node';
import { DateTime } from 'luxon';

@Injectable()
export class ExportCSVService {
  private readonly logger = new Logger(ExportCSVService.name);

  constructor() {}

  public async export() {
    try {
      const data = [];
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
      this.logger.error(`${ExportCSVService.name} - ${error}`);
      throw new UnprocessableEntityException(
        'Não foi possível processar o CSV',
      );
    }
  }

  private formatToBrazilianDate(value: string) {
    return DateTime.fromJSDate(new Date(value))
      .setLocale('pt-BR')
      .toFormat('dd/MM/yyyy HH:mm');
  }
}
