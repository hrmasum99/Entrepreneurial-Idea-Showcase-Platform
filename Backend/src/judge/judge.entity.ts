import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JudgeProfile } from "./judge.profile";
import { InvestmentEntity } from "src/investment/investment.entity";
import { ReviewEntity } from "src/review/review.entity";

@Entity("judge")
export class JudgeEntity{
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column({ type: 'varchar', length: 100, unique: true })
   email: string;

   @Column({ type: 'varchar' })
   password: string;

   @OneToOne(() => JudgeProfile, judgeProfile => judgeProfile.judgeEntity, { 
    cascade: true, // Enables cascading for insert/update
    onDelete: 'CASCADE', // Enables cascading for delete
   })
    @JoinColumn()
    judgeProfile: JudgeProfile;

    @OneToMany(() => InvestmentEntity, invest => invest.judge)
    invest: InvestmentEntity[];

    @OneToMany(() => ReviewEntity, reviews => reviews.judge)
    reviews: ReviewEntity[]; 

}