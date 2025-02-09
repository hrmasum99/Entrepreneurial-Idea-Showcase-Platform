import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { AdminProfile } from "./admin.profile";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";
import { Event_CoordinatorProfile } from "src/event-coordinator/event-coordinator.profile";
import { JudgeEntity } from "src/judge/judge.entity";
import { JudgeProfile } from "src/judge/judge.profile";
import { EntrepreneurEntity } from "src/entrepreneur/entrepreneur.entity";
import { EntrepreneurProfile } from "src/entrepreneur/entrepreneur.profile";


@Module({
    imports: [TypeOrmModule.forFeature(
              [AdminEntity, AdminProfile,Event_CoordinatorEntity,Event_CoordinatorProfile,
              JudgeEntity, JudgeProfile,
              EntrepreneurEntity, EntrepreneurProfile
              ]),],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
  })
  export class AdminModule {}