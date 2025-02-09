import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntrepreneurEntity } from "./entrepreneur.entity";

@Entity("Entrepreneur_Profile")
export class EntrepreneurProfile{
@PrimaryGeneratedColumn({name: 'ID'})
entrepreneur_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
entrepreneur_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
entrepreneur_NID: string;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
entrepreneur_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
entrepreneur_gender: string;
@Column({name: 'DOB', default: () => 'CURRENT_TIMESTAMP'})
entrepreneur_DOB: Date;
@Column({type: 'varchar', name: 'Address',default: 'N/A'})
entrepreneur_address: string;
@Column({type: 'varchar', name: 'Photo',default: 'N/A'})
entrepreneur_filename: string;
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
creationDate: Date;


@OneToOne(() => EntrepreneurEntity, entrepreneurEntity => entrepreneurEntity.entrepreneurProfile)
entrepreneurEntity: EntrepreneurEntity;
}