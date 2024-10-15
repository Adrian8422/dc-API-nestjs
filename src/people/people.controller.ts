import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Post('sync')
  async syncCronJob() {
    return this.peopleService.syncPeople();
  }
  @Get()
  async findAll(@Query('name') name?: string, @Query('height') height?: number) {
    return this.peopleService.allPeople({ name, height });
  }

  @Get(':id')
  async findById(@Param('id') id:string) {
    return this.peopleService.findByIdPeople(id)
  }
}
