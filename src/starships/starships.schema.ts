import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StarshipDocument = Starship & Document;

@Schema()
export class Starship {
  @Prop()
  name: string;

  @Prop()
  model: string;

  @Prop()
  manufacturer: string;

  @Prop()
  cost_in_credits: string;

  @Prop()
  length: string;

  @Prop()
  max_atmosphering_speed: string;

  @Prop()
  crew: string;

  @Prop()
  passengers: string;

  @Prop()
  cargo_capacity: string;

  @Prop()
  consumables: string;

  @Prop()
  hyperdrive_rating: string;

  @Prop()
  MGLT: string;

  @Prop()
  starship_class: string;

  @Prop([String])  
  pilots: string[];

  @Prop([String])  
  films: string[];

  @Prop()
  created: string;

  @Prop()
  edited: string;

  @Prop()
  url: string;
}

export const StarshipSchema = SchemaFactory.createForClass(Starship);
