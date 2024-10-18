import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Planet } from './planets.schema';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let planetModel: Model<Planet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
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
