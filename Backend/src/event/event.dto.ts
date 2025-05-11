/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

  export class EventDTO {
      
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Name" })
    name?: string;

    date?: Date;
  
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid description" })
    description: string;
  
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid location" })
    location: string;
  }