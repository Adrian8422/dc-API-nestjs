import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Film } from './films.schema';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FilmsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}
  async fetchFromSwapi() {
    try {
      const response = await lastValueFrom(
        this.httpService.get('https://swapi.dev/api/films'),
      );
      const peopleData = response.data.results;

      // Agrego la URL de imagen para cada personaje
      return peopleData.map((person, index) => ({
        ...person,
        image: `https://starwars-visualguide.com/assets/img/films/${index + 1}.jpg`,
      }));
    } catch (error) {
      throw new HttpException(
        'Error fetching data from SWAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Guardo datos en la db
  async saveToDatabase(filmData: any[]) {
    try {
      await this.filmModel.deleteMany();
      return this.filmModel.insertMany(filmData);
    } catch (error) {
      throw new HttpException(
        'Error saving film to database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async allFilms(filters: { title?: string; director?: string }) {
    try {
      const query: any = {};

      if (filters.title) {
        query.title = new RegExp(filters.title, 'i');
      }

      if (filters.director) {
        query.director = new RegExp(filters.director, 'i');
      }

      const results = await this.filmModel.find(query);

      if (results.length === 0) {
        throw new HttpException(
          'No film found with the specified filters',
          HttpStatus.NOT_FOUND,
        );
      }
      return results;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async findByIdFilm(id: string) {
    try {
      const result = await this.filmModel.findById(id);
      if (!result) {
        throw new HttpException('Film not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error instanceof HttpException
          ? error.getResponse()
          : 'Error fetching film by ID',
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async search(query?: string, limit: number = 10, offset: number = 0) {
    try {
      const filter: any = {};

      if (query) {
        filter.name = new RegExp(query, 'i'); // Expresión regular para hacer la búsqueda insensible a mayúsculas
      }

      return this.filmModel.find(filter).skip(offset).limit(limit);
    } catch (error) {
      throw new HttpException(
        'Error searching people',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Cron job
  @Cron('0 0 * * *')
  async syncFilm() {
    try {
      console.log('Sincronizando datos de Film...');
      const filmData = await this.fetchFromSwapi();
      return await this.saveToDatabase(filmData);
    } catch (error) {
      throw new HttpException(
        'Error syncing film data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
