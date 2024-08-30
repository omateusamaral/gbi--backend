import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResponseCreateFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  answer: string;

  @ApiProperty({ type: 'string', example: 'questionId' })
  @IsNotEmpty()
  @IsString()
  questionId: string;
}
