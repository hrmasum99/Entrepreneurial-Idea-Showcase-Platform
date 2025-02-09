import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntrepreneurEntity } from "./entrepreneur.entity";
import { EntrepreneurProfile } from "./entrepreneur.profile";
import { EntrepreneurService } from "./entrepreneur.service";
import { EntrepreneurController } from "./entrepreneur.controller";
import { IdeaEntity } from "src/idea/idea.entity";
import { InvestmentEntity } from "src/investment/investment.entity";
import { PresentationEntity } from "src/presentation/presentation.entity";
import { SeekingEntity } from "src/presentation/seeking.entity";
import { PrototypeEntity } from "src/prototype/prototype.entity";
import { ReviewEntity } from "src/review/review.entity";
import { OfferEntity } from "src/review/offer.entity";
import { EventEntity } from "src/event/event.entity";

@Module({
    imports: [TypeOrmModule.forFeature(
              [EntrepreneurEntity, EntrepreneurProfile, IdeaEntity, InvestmentEntity, PresentationEntity, SeekingEntity,
                 PrototypeEntity, ReviewEntity, OfferEntity, EventEntity]), ],
    controllers: [EntrepreneurController],
    providers: [EntrepreneurService],
    exports: [EntrepreneurService],
  })
  export class EntrepreneurModule {}