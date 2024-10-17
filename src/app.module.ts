import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { FilmsModule } from './films/films.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanetsModule } from './planets/planets.module';
import { StarshipsModule } from './starships/starships.module';
import { SearchModule } from './search/search.module';


@Module({
  // imports: [ MongooseModule.forRoot('mongodb://localhost:27017/mydatabase'),PeopleModule, FilmsModule, PlanetsModule, StarshipsModule],
  imports: [ MongooseModule.forRoot(process.env.DATABASE_URL),PeopleModule, FilmsModule, PlanetsModule, StarshipsModule,SearchModule],
  
})
export class AppModule {}
