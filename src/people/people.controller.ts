import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { GetAllPeopleQueryDto } from './dto/get-people.dto';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Post('sync')
  async syncCronJob() {
    return this.peopleService.syncPeople();
  }
  @Get()
  async findAll(@Query() query: GetAllPeopleQueryDto) {
    const { name, height } = query;
    return this.peopleService.allPeople({ name, height });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.peopleService.findByIdPeople(id);
  }
}
