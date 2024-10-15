import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanetDocument = Planet & Document;

@Schema()
export class Planet {
  @Prop()
  name: string;

  @Prop()
  rotation_period: string;

  @Prop()
  orbital_period: string;

  @Prop()
  diameter: string;

  @Prop()
  climate: string;

  @Prop()
  gravity: string;

  @Prop()
  terrain: string;

  @Prop()
  surface_water: string;

  @Prop()
  population: string;

  @Prop({ type: [String] }) 
  residents: string[];

  @Prop({ type: [String] })
  films: string[];

  @Prop()
  created: Date;

  @Prop()
  edited: Date;

  @Prop()
  url: string;
}

export const PlanetSchema = SchemaFactory.createForClass(Planet);
