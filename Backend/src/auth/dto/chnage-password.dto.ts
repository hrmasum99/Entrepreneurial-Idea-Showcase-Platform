import { IsString, Matches, MinLength,  } from "class-validator";

export class changePasswordDTO{
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters" })
    oldpassword: string;

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          'New password must be at least 8 characters long, contain one letter, and one number',
      })
    newpassword: string;
}