import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event_CoordinatorEntity } from "./event-coordinator.entity";

@Entity("Event_Coordinator_Profile")
export class Event_CoordinatorProfile{
@PrimaryGeneratedColumn({name: 'ID'})
event_coordinator_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
event_coordinator_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
event_coordinator_NID: string;
@Column({name: 'DOB', default: () => 'CURRENT_TIMESTAMP'})
event_coordinator_DOB: Date;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
event_coordinator_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
event_coordinator_gender: string;
@Column({type: 'varchar', name: 'Address',default: 'N/A'})
event_coordinator_address: string;
@Column({type: 'varchar', name: 'Photo',default: 'N/A'})
event_coordinator_file: string;
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
creationDate: Date;

@OneToOne(() => Event_CoordinatorEntity, event_coordinatorEntity => event_coordinatorEntity.event_coordinatorProfile)
event_coordinatorEntity: Event_CoordinatorEntity;
}