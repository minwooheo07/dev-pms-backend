import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum QATestStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum QATestResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  SKIP = 'SKIP',
}

export class CreateQATestDto {
  @IsString()
  srNumber: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  tester?: string;

  @IsOptional()
  @IsDateString()
  testDate?: string;

  @IsOptional()
  @IsUUID()
  workLogId?: string;
}

export class UpdateQATestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  tester?: string;
}
