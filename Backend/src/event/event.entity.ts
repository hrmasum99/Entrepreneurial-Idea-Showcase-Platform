import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Event_CoordinatorEntity } from 'src/event-coordinator/event-coordinator.entity';

@Entity("Event")
export class EventEntity {

    @PrimaryGeneratedColumn()
    eid: number;

    @Column({ type: 'varchar', length: 256, default: 'N/A' })
    name: string;

    @Column({ type: 'varchar', default: 'N/A' })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ type: 'varchar', default: 'N/A' })
    location: string;

    @ManyToOne(() => Event_CoordinatorEntity, eventCoordinator => eventCoordinator.events)
    eventCoordinator: Event_CoordinatorEntity;

    @OneToMany(() => IdeaEntity, idea => idea.event)
    idea: IdeaEntity[];
    
}