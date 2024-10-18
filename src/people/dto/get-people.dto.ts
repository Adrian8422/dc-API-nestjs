import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class GetAllPeopleQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;
}