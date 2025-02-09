import { Entity, JoinColumn, ManyToOne, PrimaryColumn, } from "typeorm";
import { ReviewEntity } from "./review.entity";

@Entity("Offer")
export class OfferEntity {
  @PrimaryColumn()
  rid: number;

  @PrimaryColumn({ type: 'varchar', length: 512 })
  offer: string;


  @ManyToOne(() => ReviewEntity, (review) => review.offers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rid' })
  review: ReviewEntity;
}