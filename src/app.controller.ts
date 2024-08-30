import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import {
  OrderBy,
  TargetAudience,
} from './domain/survey/interfaces/survey.interface';

@ApiTags('survey')
@Controller({ version: '1', path: '/surveys' })
export class AppController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly responseService: ResponseService,
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
  ) {
    return await this.responseService.listResponse(targetAudience, orderBy);
  }
}
