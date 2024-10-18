import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from './films.schema'; // Asumo que tienes un esquema `Film`

describe('FilmsService', () => {
  let service: FilmsService;
  let filmModel: Model<Film>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        FilmsService,
        {
          provide: getModelToken(Film.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmModel = module.get<Model<Film>>(getModelToken(Film.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
