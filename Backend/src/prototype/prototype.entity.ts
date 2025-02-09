import { IdeaEntity } from 'src/idea/idea.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity("Prototype")
export class PrototypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, default: 'N/A' })
  name: string;

  @Column({ type: 'varchar', default: 'N/A' })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'varchar',  default: 'N/A' })
  filename: string;

  @OneToOne(() => IdeaEntity, idea => idea.prototype)
  idea: IdeaEntity;

  // @ManyToOne(() => Event_CoordinatorEntity, (eventCoordinator) => eventCoordinator.events)
  // eventCoordinator: Event_CoordinatorEntity;
}