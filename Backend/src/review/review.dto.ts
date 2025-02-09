import { IsNotEmpty, IsString } from "class-validator";

export class ReviewDTO {
      
    @IsNotEmpty()
    @IsString({ message: "Please enter a Interest" })
    interest?: string;

    date?: Date;

  }