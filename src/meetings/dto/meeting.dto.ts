import { IsString, IsOptional, IsUUID, IsDateString, MaxLength, ValidateIf, IsArray } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDateString()
  meetingDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  attendees?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  participantIds?: string[];

  @IsOptional()
  @ValidateIf((o) => o.projectId != null && o.projectId !== '')
  @IsUUID()
  projectId?: string;
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDateString()
  meetingDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  attendees?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  participantIds?: string[];

  @IsOptional()
  @ValidateIf((o) => o.projectId != null && o.projectId !== '')
  @IsUUID()
  projectId?: string;
}
