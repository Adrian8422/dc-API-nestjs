import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  // Mock
  const mockFilmsService = {
    allFilms: jest.fn(),
    findByIdFilm: jest.fn(),
    syncFilm: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService, // Proveemos el mock del servicio en lugar del real
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService); // Obtenemos el servicio mockeado
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GetAllFilms', () => {
    it('should call filmsService.allFilms with correct parameters', async () => {
      const query = { title: 'A New Hope', director: 'George Lucas' };
      await controller.GetAllFilms(query.title, query.director);
      expect(service.allFilms).toHaveBeenCalledWith(query); // Verificación argumentos llamados
    });
  });

  describe('findById', () => {
    it('should call filmsService.findByIdFilm with correct ID', async () => {
      const id = '1';
      await controller.findById(id);
      expect(service.findByIdFilm).toHaveBeenCalledWith(id);
    });
  });

  describe('syncFilm', () => {
    it('should call filmsService.syncFilm', async () => {
      await controller.syncFilm();
      expect(service.syncFilm).toHaveBeenCalled(); // Verifica que el método syncFilm haya sido llamado
    });
  });
});
