import { IsNotEmpty, IsString } from "class-validator";

  export class IdeaDTO {
      
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Title" })
    title?: string;

    date?: Date;
  
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid description" })
    description: string;
  
    // @IsNotEmpty()
    // @IsString({ message: "Please enter a valid location" })
    // location: string;

  }