import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,  
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, role: payload.role, email: payload.email };
  }
}


// import { Injectable } from '@nestjs/common';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { jwtConstants } from './constants';
// import { PassportStrategy } from '@nestjs/passport';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: (req) => {
//         // Extract token from 'Authorization' header or 'token' query parameter
//         return (
//           ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
//           req?.query?.token || // Extract from query parameter
//           null
//         );
//       },
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret,
//     });
//   }

//   async validate(payload: any) {
//     return { id: payload.sub, role: payload.role, email: payload.email };
//   }
// }
