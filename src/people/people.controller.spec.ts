import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

describe('PeopleController', () => {
  let controller: PeopleController;
  let service: PeopleService;

  // Mock para el servicio de people
  const mockPeopleService = {
    syncPeople: jest.fn(),
    allPeople: jest.fn(),
    findByIdPeople: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],

      providers: [
        {
          provide: PeopleService,
          useValue: mockPeopleService,
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('syncCronJob', () => {
    it('should call peopleService.syncPeople', async () => {
      await controller.syncCronJob();
      expect(service.syncPeople).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call peopleService.allPeople with correct parameters', async () => {
      const query = { name: 'Luke Skywalker', height: 172 };
      await controller.findAll(query.name, query.height);
      expect(service.allPeople).toHaveBeenCalledWith(query);
    });
  });

  describe('findById', () => {
    it('should call peopleService.findByIdPeople with correct ID', async () => {
      const id = '1';
      await controller.findById(id);
      expect(service.findByIdPeople).toHaveBeenCalledWith(id);
    });
  });
});
