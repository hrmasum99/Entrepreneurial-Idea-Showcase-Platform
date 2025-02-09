import { Entity, JoinColumn, ManyToOne, PrimaryColumn, } from "typeorm";
import { PresentationEntity } from "./presentation.entity";

@Entity("Seeking")
export class SeekingEntity {
  @PrimaryColumn()
  pid: number;

  @PrimaryColumn({ type: 'varchar', length: 512 })
  seeking: string;


  @ManyToOne(() => PresentationEntity, (presentation) => presentation.seekings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pid' })
  presentation: PresentationEntity;
}