import { Module } from "@nestjs/common";
import { IdeaEntity } from "./idea.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature(
              [IdeaEntity, ]),],
    controllers: [],
    providers: [],
    exports: [],
  })
  export class IdeaModule {}