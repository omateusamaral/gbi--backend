import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { Survey } from './survey.model';
import { ApiTags } from '@nestjs/swagger';
import { SurveyPatchFieldsDto } from './dtos/survey-patch-fields.dto';
import { ExportCSVService } from './export-csv.service';

import { Response } from 'express';
@ApiTags('survey')
@Controller({ version: '1', path: '/survey' })
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly exportCSVService: ExportCSVService,
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
  @Get('download')
  async downloadCSV(@Res() res: Response) {
    const csv = await this.exportCSVService.export();
    res.setHeader('Content-Disposition', 'attachment; filename=survey.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  }
}
