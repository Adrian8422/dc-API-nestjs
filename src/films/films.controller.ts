import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDto } from './dto/get-films.dto';

@Controller('films')
export class FilmsController {
  constructor(private filmsService: FilmsService) {}

  GetAllFilms(@Query() query: GetFilmsDto) {
    return this.filmsService.allFilms(query);
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.filmsService.findByIdFilm(id);
  }
  @Post('/sync')
  async syncFilm() {
    return this.filmsService.syncFilm();
  }
}
