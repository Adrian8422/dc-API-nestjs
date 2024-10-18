import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Starship, StarshipSchema } from './starships.schema';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Starship.name, schema: StarshipSchema },
    ]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [StarshipsService],
  controllers: [StarshipsController],
  exports: [StarshipsService, MongooseModule],
})
export class StarshipsModule {}
