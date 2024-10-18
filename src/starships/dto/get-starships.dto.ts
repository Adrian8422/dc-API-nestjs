import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class GetAllStarshipsQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  passengers?: number;
}