import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilmDocument = Film & Document;

@Schema()
export class Film {
  @Prop()
  title: string;

  @Prop()
  episode_id: number;

  @Prop()
  opening_crawl: string;

  @Prop()
  director: string;

  @Prop()
  producer: string;

  @Prop()
  release_date: string;

  @Prop([String])
  characters: string[];

  @Prop([String])
  planets: string[];

  @Prop([String])
  starships: string[];

  @Prop([String])
  vehicles: string[];

  @Prop([String])
  species: string[];

  @Prop()
  created: string;

  @Prop()
  edited: string;

  @Prop()
  url: string;

  @Prop()
  image: string;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
