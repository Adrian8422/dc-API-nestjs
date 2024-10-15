import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
    constructor(private filmsService:FilmsService){

    }

    @Get()
    GetAllFilms(@Query('title') title?:string, @Query('director') director?:string ){
        return this.filmsService.allFilms({title,director})
    }
    @Get(':id')
    async findById(@Param('id') id:string) {
      return this.filmsService.findByIdFilm(id)
    }
    @Post('/sync')
    async syncFilm(){
        return this.filmsService.syncFilm()
    }
}
