import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PeopleDocument = People & Document;

@Schema()
export class People {
  @Prop()
  name: string;

  @Prop()
  height: string;

  @Prop()
  mass: string;

  @Prop()
  hair_color: string;

  @Prop()
  skin_color: string;

  @Prop()
  eye_color: string;

  @Prop()
  birth_year: string;

  @Prop()
  gender: string;

  @Prop()
  homeworld: string;

  @Prop([String])
  films: string[];

  @Prop([String])
  species: string[];

  @Prop([String])
  vehicles: string[];

  @Prop([String])
  starships: string[];

  @Prop()
  created: string;

  @Prop()
  edited: string;

  @Prop()
  url: string;
}

export const PeopleSchema = SchemaFactory.createForClass(People);
