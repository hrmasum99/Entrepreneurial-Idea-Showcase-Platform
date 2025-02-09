import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { PresentationEntity } from 'src/presentation/presentation.entity';
import { PrototypeEntity } from 'src/prototype/prototype.entity';
import { InvestmentEntity } from 'src/investment/investment.entity';
import { EventEntity } from 'src/event/event.entity';
import { EntrepreneurEntity } from 'src/entrepreneur/entrepreneur.entity';

@Entity("Idea")
export class IdeaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, default: 'N/A' })
  title: string;

  @Column({ type: 'varchar', default: 'N/A' })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  // @Column()
  // location: string;

  
  @OneToOne(() => PrototypeEntity, prototype => prototype.idea, { 
    cascade: true, // Enables cascading for insert/update
    onDelete: 'CASCADE', // Enables cascading for delete
  })
   @JoinColumn()
   prototype: PrototypeEntity;

   @OneToOne(() => PresentationEntity, presentation => presentation.idea, { 
    cascade: true, // Enables cascading for insert/update
    onDelete: 'CASCADE', // Enables cascading for delete
  })
   @JoinColumn()
   presentation: PresentationEntity;

   @OneToOne(() => InvestmentEntity, invest => invest.idea, { 
    cascade: true, // Enables cascading for insert/update
    onDelete: 'CASCADE', // Enables cascading for delete
  })
   @JoinColumn()
   invest: InvestmentEntity;

   @ManyToOne(() => EventEntity, event => event.idea)
    event: EventEntity;

    @ManyToOne(() => EntrepreneurEntity, (entrepreneur) => entrepreneur.ideas)
    entrepreneur: EntrepreneurEntity;
}