import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { Planet, PlanetSchema } from './planets.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Planet.name, schema: PlanetSchema }]), 
    HttpModule,
    ScheduleModule.forRoot(), 
  ],
  providers: [PlanetsService],
  controllers: [PlanetsController],
  exports: [PlanetsService, MongooseModule]
})
export class PlanetsModule {}
