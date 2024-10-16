import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Starship } from './starships.schema';

describe('StarshipsService', () => {
  let service: StarshipsService;
  let starshipModel: Model<Starship>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, // No necesitamos MongooseModule.forFeature en los tests unitarios
      ],
      providers: [
        StarshipsService,
        {
          provide: getModelToken(Starship.name), // Mockeamos el modelo de Starship
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
    starshipModel = module.get<Model<Starship>>(getModelToken(Starship.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Aquí podrías agregar otros tests, como pruebas de métodos específicos del servicio.
});
