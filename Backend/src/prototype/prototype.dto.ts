import { IsNotEmpty, IsString } from "class-validator";

  export class PrototypeDTO {
      
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Name" })
    name?: string;

    date?: Date;
  
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid description" })
    description: string;
  
    @IsNotEmpty()
    @IsString({ message: "Please insert a file" })
    filename: string;
  }