import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OfferEntity } from "./offer.entity";
import { JudgeEntity } from "src/judge/judge.entity";
import { PresentationEntity } from "src/presentation/presentation.entity";

@Entity("Review")
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  rid: number;

  @Column({ type: 'varchar', length: 64, default: 'N/A' })
  interest: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @OneToMany(() => OfferEntity, (offers) => offers.review)
  offers: OfferEntity[];

  @ManyToOne(() => JudgeEntity, (judge) => judge.reviews)
  judge: JudgeEntity;

  @ManyToOne(() => PresentationEntity, (presentation) => presentation.reviews)
  presentation: PresentationEntity;
}