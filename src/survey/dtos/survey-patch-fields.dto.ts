import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TargetAudience } from '../interfaces/survey.interface';

export class SurveyPatchFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsOptional()
  @MinLength(5)
  title?: string;

  @ApiProperty({ type: 'enum', enum: TargetAudience })
  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: TargetAudience;
}
