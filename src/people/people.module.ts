import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { People, PeopleSchema } from './people.schema';

import { HttpModule } from '@nestjs/axios'; 
import { ScheduleModule } from '@nestjs/schedule'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: People.name, schema: PeopleSchema }]), 
    HttpModule, 
    ScheduleModule.forRoot(), 
  ],
  providers: [PeopleService], 
  controllers: [PeopleController],
})
export class PeopleModule {}
