import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StarshipsService } from './starships.service';

@Controller('starships')
export class StarshipsController {
  constructor(private starshipService: StarshipsService) {}

  @Get()
  GetAllStarships(
    @Query('name') name?: string,
    @Query('passengers') passengers?: number,
  ) {
    return this.starshipService.allStarship({ name, passengers });
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.starshipService.findByIdStarship(id);
  }
  @Post('/sync')
  async syncStarship() {
    return this.starshipService.syncStarship();
  }
}
