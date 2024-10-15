import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Starship, StarshipSchema } from './starships.schema';


describe('StarshipsService', () => {
  let service: StarshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, 
        MongooseModule.forFeature([{ name: Starship.name, schema: StarshipSchema }]), 
      ],
      providers: [StarshipsService],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
