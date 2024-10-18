import { IsOptional, IsString } from 'class-validator';

export class GetAllPlanetsQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  climate?: string;
}
