import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class EntrepreneurDTO{

    @IsEmail({}, { message: "Please enter a valid email address" })
    @Matches(/^[^@]+@[^@]+\.com$/, { message: "Email must be in the format user@domain.com" })
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          'New password must be at least 8 characters long, contain one letter, and one number',
      })
    password: string;

    @Optional()
    id: number;

}

export class EntrepreneurProfileDTO{
    @IsString({ message: "Please enter a valid name" })
    @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/, { message: "Name must contain at least two words, with only letters and spaces" })
    entrepreneur_name: string;

    @IsString({ message: "Please enter a valid NID number" })
    @MaxLength(17)
    entrepreneur_NID: string;

    @IsNotEmpty({ message: "Please enter a valid phone number" })
    entrepreneur_phone: string;

    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Gender" })
    entrepreneur_gender: string;

    @IsNotEmpty({ message: "Please enter a valid Birth of Date" })
    entrepreneur_DOB?: Date;
  
    @IsNotEmpty()
    @IsString({ message: "Please enter a valid Address" })
    entrepreneur_address?: string;

    
    @IsString({ message: "Please insert a file" })
    entrepreneur_file?:string;

}