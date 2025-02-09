import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class EventCoordinatorProfileDTO {
  name?: string;
  event_coordinator_DOB?: Date;
  
  @IsString({ message: "Please enter a valid Address" })
  event_coordinator_Address?: string;

  @IsString({ message: "Please enter a valid NID number" })
  @MaxLength(17)
  event_coordinator_NID: string;

  @IsString({ message: "Please enter a valid phone number" })
  event_coordinator_phone: string;


  @IsString({ message: "Please enter a valid Gender" })
  event_coordinator_gender: string;

  @IsString({ message: "Please insert a file" })
  event_coordinator_file:string;
}

export class UpdateEventCoordinatorDTO {
  @IsOptional()
  @IsString({ message: "Please enter a valid name" })
  @Matches(/^[A-Za-z\s]+$/, { message: "Name can only contain letters and spaces" })
  event_coordinator_name?: string;

  @IsOptional()
  @IsString({ message: "Please enter a valid Address" })
  event_coordinator_Address?: string;

  @IsOptional()
  @IsString({ message: "Please enter a valid NID number" })
  @MaxLength(17, { message: "NID must be shorter than or equal to 17 characters" })
  event_coordinator_NID?: string;

  @IsOptional()
  @IsString({ message: "Please enter a valid phone number" })
  event_coordinator_phone?: string;

  @IsOptional()
  @IsString({ message: "Please enter a valid Gender" })
  event_coordinator_gender?: string;

  @IsOptional()
  @IsString({ message: "Please insert a file" })
  event_coordinator_file?: string;
}