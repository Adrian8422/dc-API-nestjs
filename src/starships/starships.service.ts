import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Starship } from './starships.schema';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StarshipsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Starship.name) private readonly starshipModel: Model<Starship>,
  ) {}
  async fetchFromSwapi() {
    try {
      const response = await lastValueFrom(this.httpService.get('https://swapi.dev/api/starships'));
      const peopleData = response.data.results;

      // Agregamos la URL de imagen para cada personaje
      return peopleData.map((person, index) => ({
        ...person,
        image: `https://starwars-visualguide.com/assets/img/starships/${index + 1}.jpg`,
      }));
    } catch (error) {
      throw new HttpException('Error fetching data from SWAPI', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 
  async saveToDatabase(starshipData: any[]) {
    try {
      await this.starshipModel.deleteMany(); 
      return this.starshipModel.insertMany(starshipData);
    } catch (error) {
      throw new HttpException(
        'Error saving starship to database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 
  async allStarship(filters: { name?: string; passengers?: number }) {
    try {
      const query: any = {};

      if (filters.name) {
        query.name = new RegExp(filters.name, 'i');
      }

      if (filters.passengers) {
        query.passengers = filters.passengers; 
      }

      const results = await this.starshipModel.find(query);

      if (results.length === 0) {
        throw new HttpException(
          'No startship found with the specified filters',
          HttpStatus.NOT_FOUND,
        );
      }
      return results;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async findByIdStarship(id: string) {
    try {
      const result = await this.starshipModel.findById(id);
      if (!result) {
        throw new HttpException('Starship not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
     
      throw new HttpException(
        error instanceof HttpException
          ? error.getResponse()
          : 'Error fetching starship by ID',
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async search(query?: string, limit: number = 10, offset: number = 0) {
    try {
        const filter: any = {};

        // Si se proporciona un query, filtra por nombre
        if (query) {
            filter.name = new RegExp(query, 'i'); // Utiliza expresión regular para hacer la búsqueda insensible a mayúsculas
        }

        // Realiza la búsqueda en la base de datos
        return this.starshipModel
            .find(filter) // Filtra usando el objeto filter
            .skip(offset) // Ignora los primeros `offset` resultados
            .limit(limit); // Limita los resultados a `limit`
    } catch (error) {
        throw new HttpException('Error searching people', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

  
  @Cron('0 0 * * *')
  async syncStarship() {
    try {
      console.log('Sincronizando datos de Starships...');
      const planetData = await this.fetchFromSwapi();
      return await this.saveToDatabase(planetData);
    } catch (error) {
      throw new HttpException(
        'Error syncing planet data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
