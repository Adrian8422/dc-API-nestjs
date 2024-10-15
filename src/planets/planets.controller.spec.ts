import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { HttpModule } from '@nestjs/axios';

describe('PlanetsController', () => {
  let controller: PlanetsController;
  let service: PlanetsService;

  
  const mockPlanetsService = {
    allPlanets: jest.fn(),
    findByIdPlanet: jest.fn(),
    syncPlanet: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      providers: [
        {
          provide: PlanetsService,
          useValue: mockPlanetsService, // Usamos el mock para el servicio
        },
      ],
    }).compile();

    controller = module.get<PlanetsController>(PlanetsController);
    service = module.get<PlanetsService>(PlanetsService); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetAllFilms', () => {
    it('should call planetsService.allPlanets with correct parameters', async () => {
      const query = { name: 'Tatooine', climate: 'arid' };
      await controller.GetAllFilms(query.name, query.climate);
      expect(service.allPlanets).toHaveBeenCalledWith(query); 
    });
  });

  describe('findById', () => {
    it('should call planetsService.findByIdPlanet with correct ID', async () => {
      const id = '1';
      await controller.findById(id);
      expect(service.findByIdPlanet).toHaveBeenCalledWith(id); 
    });
  });

  describe('syncPlanet', () => {
    it('should call planetsService.syncPlanet', async () => {
      await controller.syncPlanet();
      expect(service.syncPlanet).toHaveBeenCalled(); 
    });
  });
});
