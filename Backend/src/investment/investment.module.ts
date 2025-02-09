import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvestmentEntity } from "./investment.entity";

@Module({
    imports: [TypeOrmModule.forFeature(
              [InvestmentEntity, ]),],
    controllers: [],
    providers: [],
    exports: [],
  })
  export class InvestmentModule {}