import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator';

export class CreateFormTemplateDto {
  @IsString()
  @MaxLength(100)
  name: string;
}

export class UpdateFormTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  schema?: any[];
}

export class SubmitFormDto {
  @IsOptional()
  data?: Record<string, any>;
}
