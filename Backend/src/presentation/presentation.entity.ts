import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { JudgeEntity } from 'src/judge/judge.entity';
import { SeekingEntity } from './seeking.entity';
import { ReviewEntity } from 'src/review/review.entity';


@Entity("Presentation")
export class PresentationEntity {
  @PrimaryGeneratedColumn()
  pid: number;

  @Column({ type: 'varchar', length: 64, default: 'N/A' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @OneToOne(() => IdeaEntity, idea => idea.presentation)
  idea: IdeaEntity;

  @OneToMany(() => SeekingEntity, (seekings) => seekings.presentation)
  seekings: SeekingEntity[];

  @OneToMany(() => ReviewEntity, (reviews) => reviews.presentation)
  reviews: ReviewEntity[];

}