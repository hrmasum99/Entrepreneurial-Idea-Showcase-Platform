import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JudgeEntity } from "./judge.entity";
import { JudgeProfile } from "./judge.profile";
import { JudgeService } from "./judge.service";
import { JudgeController } from "./judge.controller";
import { ReviewEntity } from "src/review/review.entity";
import { OfferEntity } from "src/review/offer.entity";
import { PresentationEntity } from "src/presentation/presentation.entity";


@Module({
    imports: [TypeOrmModule.forFeature(
              [JudgeEntity, JudgeProfile, ReviewEntity, OfferEntity, PresentationEntity]),],
    controllers: [JudgeController],
    providers: [JudgeService],
    exports: [JudgeService],
  })
  export class JudgeModule {}