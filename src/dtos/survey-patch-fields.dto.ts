import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { TargetAudience } from 'src/interfaces/survey.interface';

export class SurveyPatchFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsOptional()
  @MinLength(5)
  title?: string;

  @ApiProperty({ type: 'number', example: 5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  starRating?: number;

  @ApiProperty({ type: 'enum', enum: TargetAudience })
  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: TargetAudience;

  @ApiProperty({ type: 'string', example: 'email@gmail.com' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}
