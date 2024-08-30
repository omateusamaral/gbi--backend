import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SurveyPatchFieldsDto,
  SurveyService,
  SurveyCreateFieldsDto,
} from './domain/survey';
import {
  Response,
  ResponseCreateFieldsDto,
  ResponseService,
  Survey,
} from './domain';
import { TargetAudience } from './domain/survey/interfaces/survey.interface';
import { Response as ResponseExpress } from 'express';
import { CSVService } from './csv/csv.service';
import { OrderBy } from './domain/response/interfaces/response.interface';

@ApiTags('survey')
@Controller({ version: '1', path: '/surveys' })
export class AppController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly responseService: ResponseService,
    private readonly csvService: CSVService,
  ) {}

  @Post()
  async createSurvey(@Body() survey: SurveyCreateFieldsDto): Promise<Survey> {
    return await this.surveyService.createSurvey(survey);
  }

  @Patch(':surveyId')
  async patchSurvey(
    @Param('surveyId') surveyId: string,
    @Body() survey: SurveyPatchFieldsDto,
  ): Promise<Survey> {
    return await this.surveyService.patchSurvey(surveyId, survey);
  }

  @Post(':surveyId/responses')
  async createResponse(
    @Param('surveyId') surveyId: string,
    @Body() response: ResponseCreateFieldsDto,
  ): Promise<Response> {
    return await this.responseService.createResponse(surveyId, response);
  }

  @Get('responses')
  async listResponse(
    @Query('targetAudience') targetAudience: TargetAudience,
    @Query('orderBy') orderBy: OrderBy,
  ): Promise<Response[]> {
    return await this.responseService.listResponse(targetAudience, orderBy);
  }
  @Get('download')
  async downloadCSV(
    @Res() res: ResponseExpress,
    @Query('targetAudience') targetAudience: TargetAudience,
  ): Promise<void> {
    const csv = await this.csvService.export(targetAudience);
    res.setHeader('Content-Disposition', 'attachment; filename=answers.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  }
}
