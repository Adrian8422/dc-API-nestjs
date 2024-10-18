import { IsOptional, IsString } from 'class-validator';
export class GetFilmsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  director?: string;
}
