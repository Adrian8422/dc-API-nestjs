import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { GetAllPlanetsQueryDto } from './dto/get-planets.dto';

@Controller('planets')
export class PlanetsController {
  constructor(private planetsService: PlanetsService) {}

  @Get()
  async GetAllPlanets(@Query() query: GetAllPlanetsQueryDto) {
    const { name, climate } = query;
    return this.planetsService.allPlanets({ name, climate });
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.planetsService.findByIdPlanet(id);
  }
  @Post('/sync')
  async syncPlanet() {
    return this.planetsService.syncPlanet();
  }
}
