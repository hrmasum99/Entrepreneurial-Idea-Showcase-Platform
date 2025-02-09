import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrototypeEntity } from "./prototype.entity";

@Module({
    imports: [TypeOrmModule.forFeature(
              [PrototypeEntity, ]),],
    controllers: [],
    providers: [],
    exports: [],
  })
  export class PrototypeModule {}