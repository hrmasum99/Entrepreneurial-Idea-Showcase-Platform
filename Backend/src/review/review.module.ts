import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewEntity } from "./review.entity";
import { OfferEntity } from "./offer.entity";

@Module({
    imports: [TypeOrmModule.forFeature(
              [ReviewEntity, OfferEntity]),],
    controllers: [],
    providers: [],
    exports: [],
  })
  export class ReviewModule {}