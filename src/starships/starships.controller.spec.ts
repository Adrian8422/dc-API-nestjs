import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsController } from './starships.controller';
import { StarshipsService } from './starships.service';
import { HttpModule } from '@nestjs/axios';

describe('StarshipsController', () => {
  let controller: StarshipsController;
  let service: StarshipsService;


  const mockStarshipsService = {
    allStarship: jest.fn(),
    findByIdStarship: jest.fn(),
    syncStarship: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarshipsController],
      
      providers: [
        {
          provide: StarshipsService,
          useValue: mockStarshipsService, 
        },
      ],
    }).compile();

    controller = module.get<StarshipsController>(StarshipsController);
    service = module.get<StarshipsService>(StarshipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetAllStarships', () => {
    it('should call starshipService.allStarship with correct parameters', async () => {
      const query = { name: 'CR90 corvette', passengers: 600 };
      await controller.GetAllStarships(query.name, query.passengers);
      expect(service.allStarship).toHaveBeenCalledWith(query); 
    });
  });

  describe('findById', () => {
    it('should call starshipService.findByIdStarship with correct ID', async () => {
      const id = '1';
      await controller.findById(id);
      expect(service.findByIdStarship).toHaveBeenCalledWith(id); 
    });
  });

  describe('syncStarship', () => {
    it('should call starshipService.syncStarship', async () => {
      await controller.syncStarship();
      expect(service.syncStarship).toHaveBeenCalled(); 
    });
  });
});
