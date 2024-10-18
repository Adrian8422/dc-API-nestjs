import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PeopleService } from '../people/people.service';
import { FilmsService } from '../films/films.service';
import { StarshipsService } from '../starships/starships.service';
import { PlanetsService } from '../planets/planets.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly filmsService: FilmsService,
    private readonly starshipsService: StarshipsService,
    private readonly planetsService: PlanetsService,
  ) {}

  @Get()
  async globalSearch(
    @Query('query') query?: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const [people, films, starships, planets] = await Promise.all([
      this.peopleService.search(query, limit, offset),
      this.filmsService.search(query, limit, offset),
      this.starshipsService.search(query, limit, offset),
      this.planetsService.search(query, limit, offset),
    ]);

    return {
      people,
      films,
      starships,
      planets,
    };
  }
}
