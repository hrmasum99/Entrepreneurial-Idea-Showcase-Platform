import { AdminEntity } from "src/admin/admin.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event_CoordinatorProfile } from "./event-coordinator.profile";
import { EventEntity } from "../event/event.entity";

@Entity("event-coordinator")
 export class Event_CoordinatorEntity{
   @PrimaryGeneratedColumn()
   id: number;
   @Column()
   name: string;
   @Column()
   email: string;
   @Column()
   password: string;
   //  @Column()
   //   filename: string;


   @ManyToOne(() => AdminEntity, admin => admin.evt_co)
   
   admin: AdminEntity;

   @OneToOne(() => Event_CoordinatorProfile, event_coordinatorProfile => event_coordinatorProfile.event_coordinatorEntity, { cascade: true, // Enables cascading for insert/update
   onDelete: 'CASCADE', // Enables cascading for delete
   })
   @JoinColumn()
   event_coordinatorProfile: Event_CoordinatorProfile;
      //eventCoordinatorProfile: any;

   @OneToMany(() => EventEntity, events => events.eventCoordinator, { cascade: true })
   events: EventEntity[];

}