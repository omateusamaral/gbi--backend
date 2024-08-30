import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from './response.model';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ResponseCreateFieldsDto } from './dtos/response-create-fields.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
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
    const responsePlainToClass = plainToClass(Response, {
      ...responseCreateFields,
      surveyId,
    });

    const response = await this.responseRepository.insert(responsePlainToClass);

    return await this.getResponse(response.identifiers[0].responseId);
  }
}
