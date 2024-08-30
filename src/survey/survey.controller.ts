import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { Survey } from './survey.model';
import { ApiTags } from '@nestjs/swagger';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';

@ApiTags('survey')
@Controller({ version: '1', path: '/survey' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

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
}
