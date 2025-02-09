import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { AdminEntity } from "./admin.entity";

@Entity("Admin_Profile")
export class AdminProfile{
@PrimaryGeneratedColumn({name: 'ID'})
admin_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
admin_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
admin_NID: string;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
admin_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
admin_gender: string;
@Column({name: 'DOB', default: () => 'CURRENT_TIMESTAMP'})
admin_DOB: Date;
@Column({type: 'varchar', name: 'Address',default: 'N/A'})
admin_address: string;
@Column({type: 'varchar', name: 'filename',default: 'N/A'})
admin_filename: string;
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
creationDate: Date;


@OneToOne(() => AdminEntity, adminEntity => adminEntity.adminProfile)
adminEntity: AdminEntity;

}
