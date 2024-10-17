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

  // Obtengo data de la API externa
  async fetchFromSwapi() {
    try {
      const response = await lastValueFrom(this.httpService.get('https://swapi.dev/api/people'));
      const peopleData = response.data.results;

      // Agregamos la URL de imagen para cada personaje
      return peopleData.map((person, index) => ({
        ...person,
        image: `https://starwars-visualguide.com/assets/img/characters/${index + 1}.jpg`,
      }));
    } catch (error) {
      throw new HttpException('Error fetching data from SWAPI', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 
  async saveToDatabase(peopleData: any[]) {
    try {
      await this.peopleModel.deleteMany(); // Elimina datos existentes antes de guardar nuevos
      return this.peopleModel.insertMany(peopleData);
    } catch (error) {
      throw new HttpException('Error saving people to database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 
  async allPeople(filters: { name?: string; height?: number; limit?: number; offset?: number }) {
    try {
      const { name, height, limit = 10, offset = 0 } = filters;
  
      // Construcción del query
      const query: any = {};
      if (name) query.name = new RegExp(name, 'i'); // Insensible a mayúsculas
      if (height) query.height = height;
  
      // Ejecución del query con paginación
      const results = await this.peopleModel
        .find(query)
        .skip(offset)
        .limit(limit)
        .exec();
  
      const total = await this.peopleModel.countDocuments(query); // Conteo total para paginación
  
      if (results.length === 0) {
        throw new HttpException('No se encontraron personas con los filtros especificados.', HttpStatus.NOT_FOUND);
      }
  
      return { results, total };
    } catch (error) {
      throw new HttpException(
        error instanceof HttpException ? error.getResponse() : 'Error al obtener personas',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
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
        error instanceof HttpException ? error.getResponse() : 'Error fetching people by ID',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  


  @Cron('0 0 * * *')
  async syncPeople() {
    try {
      console.log('Sincronizando datos de People...');
      const peopleData = await this.fetchFromSwapi();
      console.log({peopleData})
      return await this.saveToDatabase(peopleData);
    } catch (error) {
      throw new HttpException('Error syncing people data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
