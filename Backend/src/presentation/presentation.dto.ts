import { IsNotEmpty, IsString } from "class-validator";

  export class PresentationDTO {
      
    @IsNotEmpty()
    @IsString({ message: "Please enter a status" })
    status?: string;

    date?: Date;
  }

  export class SeekingDTO {
      
    @IsNotEmpty()
    @IsString()
    seeking?: string;
    pid?: number;
  }