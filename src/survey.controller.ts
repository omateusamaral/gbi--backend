import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyCreateFieldsDto } from './dtos/survey-create-fields.dto';
import { Survey } from './survey.model';
import {
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TargetAudience } from './interfaces/TargetAudience';
import { OrderBy } from './interfaces/OrderBy';
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

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Survey,
  })
  @Post()
  async createSurvey(@Body() survey: SurveyCreateFieldsDto): Promise<Survey> {
    return await this.surveyService.createSurvey(survey);
  }

  @ApiQuery({
    name: 'targetAudience',
    description: 'Target audience for the surveys',
    type: String,
    enum: TargetAudience,
    required: true,
  })
  @ApiQuery({
    name: 'orderBy',
    description: 'Order the surveis',
    type: String,
    enum: OrderBy,
    required: true,
  })
  @ApiQuery({
    name: 'starRating',
    description: 'Star rating of the surveys',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of surveys per page',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'pageToken',
    description: 'Token for pagination to get the next page of results',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List records created.',
    example: {
      values: [
        {
          surveyId: 'e4e39880-8e8b-415a-92a3-4580413814bb',
          title: 'title',
          targetAudience: 'Young Adults (18-35 years)',
          starRating: 5,
          contactEmail: 'email@gmail.com',
          createdAt: '2024-08-29T04:12:18.013Z',
          updatedAt: '2024-08-29T04:12:18.013Z',
        },
      ],
      nextPageToken: '',
    },
  })
  @Get()
  async listSurveys(
    @Query('targetAudience') targetAudience: TargetAudience,
    @Query('orderBy') orderBy: OrderBy,
    @Query('starRating') starRating: number,
    @Query('pageSize', new DefaultValuePipe('10'), ParseIntPipe)
    pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ): Promise<{
    values: Survey[];
    nextPageToken?: string;
  }> {
    return await this.surveyService.listSurveys(
      targetAudience,
      starRating,
      orderBy,
      pageSize,
      pageToken,
    );
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
