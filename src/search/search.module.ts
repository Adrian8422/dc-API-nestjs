import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { PeopleService } from '../people/people.service';
import { FilmsService } from '../films/films.service';
import { StarshipsService } from '../starships/starships.service';
import { PlanetsService } from '../planets/planets.service';
import { HttpModule } from '@nestjs/axios';
import { PeopleModule } from 'src/people/people.module';
import { FilmsModule } from 'src/films/films.module';
import { StarshipsModule } from 'src/starships/starships.module';
import { PlanetsModule } from 'src/planets/planets.module';

@Module({
  imports: [
    PeopleModule,
    FilmsModule,
    StarshipsModule,
    PlanetsModule,
    HttpModule,
  ],
  controllers: [SearchController],
  providers: [PeopleService, FilmsService, StarshipsService, PlanetsService],
})
export class SearchModule {}
