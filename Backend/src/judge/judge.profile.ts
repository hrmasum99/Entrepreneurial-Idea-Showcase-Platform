import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JudgeEntity } from "./judge.entity";

@Entity("Judge_Profile")
export class JudgeProfile{
@PrimaryGeneratedColumn({name: 'ID'})
judge_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
judge_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
judge_NID: string;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
judge_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
judge_gender: string;
@Column({name: 'DOB', default: () => 'CURRENT_TIMESTAMP'})
judge_DOB: Date;
@Column({type: 'varchar', name: 'Address',default: 'N/A'})
judge_address: string;
@Column({type: 'varchar', name: 'Photo',default: 'N/A'})
judge_filename: string;
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
creationDate: Date;


@OneToOne(() => JudgeEntity, judgeEntity => judgeEntity.judgeProfile)
judgeEntity: JudgeEntity;
}