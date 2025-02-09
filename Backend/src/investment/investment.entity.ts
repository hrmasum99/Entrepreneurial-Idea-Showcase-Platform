import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Event_CoordinatorEntity } from '../event-coordinator/event-coordinator.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import { JudgeEntity } from 'src/judge/judge.entity';


@Entity("Investment")
export class InvestmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'varchar', default: 'N/A' })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @OneToOne(() => IdeaEntity, idea => idea.invest)
  idea: IdeaEntity;

  @ManyToOne(() => JudgeEntity, (judge) => judge.invest)
  judge: JudgeEntity[];
}