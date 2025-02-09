import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntrepreneurProfile } from "./entrepreneur.profile";
import { IdeaEntity } from "src/idea/idea.entity";

@Entity("entrepreneur")
export class EntrepreneurEntity{
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column({ type: 'varchar', length: 100, unique: true })
   email: string;

   @Column({ type: 'varchar' })
   password: string;

   @OneToOne(() => EntrepreneurProfile, entrepreneurProfile => entrepreneurProfile.entrepreneurEntity, { 
    cascade: true, // Enables cascading for insert/update
    onDelete: 'CASCADE', // Enables cascading for delete 
   })
    @JoinColumn()
    entrepreneurProfile: EntrepreneurProfile;

    @OneToMany(() => IdeaEntity, ideas => ideas.entrepreneur, { cascade: true, onDelete: 'CASCADE', })
    ideas: IdeaEntity[];

}