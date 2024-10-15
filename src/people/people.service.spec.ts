import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { People, PeopleSchema } from './people.schema'; // Asegúrate de que el esquema esté bien importado
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('PeopleService', () => {
  let service: PeopleService;
  let peopleModel: Model<People>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, 
        MongooseModule.forFeature([{ name: People.name, schema: PeopleSchema }]), // Registra el modelo para Mongoose
      ],
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
          provide: HttpService, // Provee HttpService para las pruebas
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
      const mockApiResponse :any = { data: { results: [{ name: 'Luke Skywalker' }] } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockApiResponse));

      const result = await service.fetchFromSwapi();
      expect(result).toEqual(mockApiResponse.data.results);
      expect(httpService.get).toHaveBeenCalledWith('https://swapi.dev/api/people');
    });

    it('should throw an HttpException when there is an error', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => { throw new Error(); });

      await expect(service.fetchFromSwapi()).rejects.toThrow(HttpException);
    });
  });

  describe('saveToDatabase', () => {
    it('should delete existing data and save new data', async () => {
      const mockPeopleData:any = [{ name: 'Luke Skywalker' }];
      jest.spyOn(peopleModel, 'deleteMany').mockResolvedValue(null);
      jest.spyOn(peopleModel, 'insertMany').mockResolvedValue(mockPeopleData);

      const result = await service.saveToDatabase(mockPeopleData);
      expect(result).toEqual(mockPeopleData);
      expect(peopleModel.deleteMany).toHaveBeenCalled();
      expect(peopleModel.insertMany).toHaveBeenCalledWith(mockPeopleData);
    });

    it('should throw an HttpException when there is an error', async () => {
      jest.spyOn(peopleModel, 'deleteMany').mockImplementation(() => { throw new Error(); });

      await expect(service.saveToDatabase([])).rejects.toThrow(HttpException);
    });
  });

  describe('allPeople', () => {
    it('should return people based on filters', async () => {
      const mockPeople = [{ name: 'Luke Skywalker', height: 172 }];
      jest.spyOn(peopleModel, 'find').mockResolvedValue(mockPeople);

      const filters = { name: 'Luke' };
      const result = await service.allPeople(filters);
      expect(result).toEqual(mockPeople);
      expect(peopleModel.find).toHaveBeenCalledWith({ name: /Luke/i });
    });

    it('should throw an HttpException if no people are found', async () => {
      jest.spyOn(peopleModel, 'find').mockResolvedValue([]);

      const filters = { name: 'Unknown' };
      await expect(service.allPeople(filters)).rejects.toThrow(HttpException);
    });
  });

  describe('findByIdPeople', () => {
    it('should return a person by ID', async () => {
      const mockPerson = { name: 'Luke Skywalker' };
      jest.spyOn(peopleModel, 'findById').mockResolvedValue(mockPerson);

      const result = await service.findByIdPeople('some-id');
      expect(result).toEqual(mockPerson);
      expect(peopleModel.findById).toHaveBeenCalledWith('some-id');
    });

    it('should throw an HttpException if no person is found', async () => {
      jest.spyOn(peopleModel, 'findById').mockResolvedValue(null);

      await expect(service.findByIdPeople('invalid-id')).rejects.toThrow(HttpException);
    });
  });
});
