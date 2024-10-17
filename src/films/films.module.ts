import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { Film, FilmSchema } from './films.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]), 
    HttpModule, 
    ScheduleModule.forRoot(),  ],
  providers: [FilmsService],
  controllers: [FilmsController],
  exports: [FilmsService, MongooseModule]
})
export class FilmsModule {}
