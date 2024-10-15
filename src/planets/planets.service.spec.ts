import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Planet, PlanetSchema } from './planets.schema'; 
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let planetModel: Model<Planet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, 
        MongooseModule.forFeature([{ name: Planet.name, schema: PlanetSchema }]), 
      ],
      providers: [
        PlanetsService,
        {
          provide: getModelToken(Planet.name), 
          useValue: {
            find: jest.fn(), 
            findById: jest.fn(), 
            insertMany: jest.fn(), 
            deleteMany: jest.fn(), 
          },
        },
      ],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
    planetModel = module.get<Model<Planet>>(getModelToken(Planet.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
