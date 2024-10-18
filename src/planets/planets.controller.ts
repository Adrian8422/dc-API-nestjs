import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlanetsService } from './planets.service';

@Controller('planets')
export class PlanetsController {
  constructor(private planetsService: PlanetsService) {}

  @Get()
  GetAllFilms(
    @Query('name') name?: string,
    @Query('climate') climate?: string,
  ) {
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
