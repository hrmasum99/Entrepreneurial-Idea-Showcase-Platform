import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event_CoordinatorProfile } from "./event-coordinator.profile";
import { Event_CoordinatorEntity } from "./event-coordinator.entity";
import { EventEntity } from "../event/event.entity";
import { EventCoordinatorController } from "./event-coordinator.controller";
import { EventCoordinatorService } from "./event-coordinator.service";

@Module({
    imports: [TypeOrmModule.forFeature(
              [Event_CoordinatorEntity, Event_CoordinatorProfile, EventEntity]), ],
    controllers: [EventCoordinatorController],
    providers: [EventCoordinatorService],
    exports: [EventCoordinatorService],
  })
  export class EventCoordinatorModule {}