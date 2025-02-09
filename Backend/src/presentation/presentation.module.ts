import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PresentationEntity } from "./presentation.entity";
import { SeekingEntity } from "./seeking.entity";

@Module({
    imports: [TypeOrmModule.forFeature(
              [PresentationEntity, SeekingEntity
                ]),],
    controllers: [],
    providers: [],
    exports: [],
  })
  export class PresentationModule {}