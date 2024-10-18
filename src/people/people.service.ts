import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { People } from './people.schema';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PeopleService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(People.name) private readonly peopleModel: Model<People>,
  ) {}

  async fetchFromSwapi() {
    try {
      const response = await lastValueFrom(
        this.httpService.get('https://swapi.dev/api/people'),
      );
      const peopleData = response.data.results;

      return peopleData.map((person, index) => ({
        ...person,
        image: `https://starwars-visualguide.com/assets/img/characters/${index + 1}.jpg`,
      }));
    } catch (error) {
      throw new HttpException(
        'Error fetching data from SWAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveToDatabase(peopleData: any[]) {
    try {
      await this.peopleModel.deleteMany();
      return this.peopleModel.insertMany(peopleData);
    } catch (error) {
      throw new HttpException(
        'Error saving people to database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async allPeople(filters: { name?: string; height?: number }) {
    try {
      const query: any = {};

      if (filters.name) {
        query.name = new RegExp(filters.name, 'i');
      }

      if (filters.height) {
        query.height = filters.height;
      }

      const results = await this.peopleModel.find(query);

      if (results.length === 0) {
        throw new HttpException(
          'No people found with the specified filters',
          HttpStatus.NOT_FOUND,
        );
      }
      return results;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
  async findByIdPeople(id: string) {
    try {
      const result = await this.peopleModel.findById(id);

      if (!result) {
        throw new HttpException('Person not found', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error instanceof HttpException
          ? error.getResponse()
          : 'Error fetching people by ID',
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
        filter.name = new RegExp(query, 'i'); //Expresión regular para hacer la búsqueda insensible a mayúsculas
      }

      return this.peopleModel.find(filter).skip(offset).limit(limit);
    } catch (error) {
      throw new HttpException(
        'Error searching people',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron('0 0 * * *')
  async syncPeople() {
    try {
      console.log('Sincronizando datos de People...');
      const peopleData = await this.fetchFromSwapi();
      console.log({ peopleData });
      return await this.saveToDatabase(peopleData);
    } catch (error) {
      throw new HttpException(
        'Error syncing people data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
