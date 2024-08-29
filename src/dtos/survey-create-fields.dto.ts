import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { TargetAudience } from 'src/interfaces/TargetAudience';

export class SurveyCreateFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @ApiProperty({ type: 'number', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  starRating: number;

  @ApiProperty({ type: 'enum', enum: TargetAudience })
  @IsEnum(TargetAudience)
  @IsNotEmpty()
  targetAudience: TargetAudience;

  @ApiProperty({ type: 'string', example: 'email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;
}
