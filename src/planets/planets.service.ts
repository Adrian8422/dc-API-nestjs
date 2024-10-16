import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Planet } from './planets.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PlanetsService {

    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Planet.name) private readonly planetModel: Model<Planet>,
      ) {}
      async fetchFromSwapi() {
        try {
          const response = await lastValueFrom(this.httpService.get('https://swapi.dev/api/planets'));
          const peopleData = response.data.results;
    
          // Agregamos la URL de imagen para cada personaje
          return peopleData.map((person, index) => ({
            ...person,
            image: `https://starwars-visualguide.com/assets/img/planets/${index + 1}.jpg`,
          }));
        } catch (error) {
          throw new HttpException('Error fetching data from SWAPI', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
     
      async saveToDatabase(planetData: any[]) {
        try {
          await this.planetModel.deleteMany(); // Elimina datos existentes antes de guardar nuevos
          return this.planetModel.insertMany(planetData);
        } catch (error) {
          throw new HttpException('Error saving planet to database', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }


  async allPlanets(filters: { name?: string, climate?: string }) {
    try {
      const query: any = {};
  
      if (filters.name) {
        query.name = new RegExp(filters.name, 'i'); 
      }
  
      if (filters.climate) {
        query.climate = new RegExp(filters.climate,'i'); 
      }
 
      

      const results = await this.planetModel.find(query)

      if (results.length === 0) {
        throw new HttpException('No planet found with the specified filters', HttpStatus.NOT_FOUND);
      }
      return results
    } catch (error) {
      throw new HttpException(error.message,error.statusCode);
    }
  }

  async findByIdPlanet(id: string) {
    try {
      const result = await this.planetModel.findById(id);
      if (!result) {
        throw new HttpException('Planet not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
     
      throw new HttpException(
        error instanceof HttpException ? error.getResponse() : 'Error fetching Planet by ID',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

@Cron('0 0 * * *')
async syncPlanet() {
  try {
    console.log('Sincronizando datos de Planets...');
    const planetData = await this.fetchFromSwapi();
    return await this.saveToDatabase(planetData);
  } catch (error) {
    throw new HttpException('Error syncing planet data', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}
