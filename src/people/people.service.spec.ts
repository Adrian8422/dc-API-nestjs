import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { HttpModule } from '@nestjs/axios';
import { People } from './people.schema'; // Asegúrate de que el esquema esté bien importado
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';

describe('PeopleService', () => {
  let service: PeopleService;
  let peopleModel: Model<People>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PeopleService,
        {
          provide: getModelToken(People.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    peopleModel = module.get<Model<People>>(getModelToken(People.name));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchFromSwapi', () => {
    it('should fetch data from SWAPI and return results', async () => {
      const mockApiResponse: AxiosResponse = {
        data: { results: [{ name: 'Luke Skywalker' }] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockApiResponse));

      const result = await service.fetchFromSwapi();

      expect(result).toEqual(mockApiResponse.data.results);

      // Verifico que se llame a la API correcta
      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/people',
      );
    });

    it('should throw an HttpException when there is an error', async () => {
      // Simulo un error en la llamada HTTP usando throwError
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('Failed to fetch')));

      // Verifico que se arroje el HttpException correcto
      await expect(service.fetchFromSwapi()).rejects.toThrow(HttpException);
    });
  });
});
