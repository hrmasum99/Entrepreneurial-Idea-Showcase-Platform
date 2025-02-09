import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { Repository } from "typeorm";
import { AdminProfile } from "./admin.profile";
import { AuthDTO } from "../auth/dto/auth.dto";
import { changePasswordDTO } from "src/auth/dto/chnage-password.dto";
import * as bcrypt from 'bcrypt'; 
import { AdminDTO, AdminProfileDTO, AdminUpdateDateDTO, AdminUpdateDTO } from "./admin.dto";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";
import { Event_CoordinatorProfile } from "src/event-coordinator/event-coordinator.profile";
import { JudgeEntity } from "src/judge/judge.entity";
import { JudgeProfile } from "src/judge/judge.profile";
import { EntrepreneurEntity } from "src/entrepreneur/entrepreneur.entity";
import { EntrepreneurProfile } from "src/entrepreneur/entrepreneur.profile";
import { JudgeDTO, JudgeProfileDTO, JudgeUpdateDTO } from "src/judge/judge.dto";
import { EntrepreneurDTO, EntrepreneurProfileDTO } from "src/entrepreneur/entrepreneur.dto";

@Injectable()
export class AdminService {
  //[x: string]: any;
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>, @InjectRepository(AdminProfile) 
    private readonly adminProfileRepo: Repository<AdminProfile>, 
    @InjectRepository(Event_CoordinatorEntity) 
    private readonly eventCoordinatorRepo: Repository<Event_CoordinatorEntity>, @InjectRepository(Event_CoordinatorProfile) 
    private readonly eventCoordinatorProfileRepo: Repository<Event_CoordinatorProfile>,
    @InjectRepository(JudgeEntity)
    private readonly judgeRepo: Repository<JudgeEntity>, @InjectRepository(JudgeProfile) 
    private readonly judgeProfileRepo: Repository<JudgeProfile>,
    @InjectRepository(EntrepreneurEntity)
    private readonly entrepreneurRepo: Repository<EntrepreneurEntity>, 
    @InjectRepository(EntrepreneurProfile) 
    private readonly entrepreneurProfileRepo: Repository<EntrepreneurProfile>,
  ) {}

  async addAdmin(myobj: AdminDTO): Promise<any> {
      
    const userEmail = await this.adminRepo.findOne({where: { email: myobj.email }});
    if (userEmail) {
      throw new BadRequestException('This email is already used!');
    }
    const admin= new AdminEntity();
    admin.email = myobj.email;
    admin.password = myobj.password; 

    const profile = new AdminProfile();
    await this.adminProfileRepo.save(profile);
    console.log("admin create");
    admin.adminProfile = profile;
    console.log("admin profile create");
    return await this.adminRepo.save(admin);
  }

    findByEmail(email: string) {
      throw new Error('Method not implemented.');
    }

    async getAllAdmin(): Promise<AdminEntity[]> {
        return await this.adminRepo.find();
    }

    async  getAdminById(id:number): Promise<AdminEntity> {
        return await this.adminRepo.findOne({
            where: { id }
        });
    }

    async  getAdminByEmail(email:string): Promise<AdminEntity> {
        return await this.adminRepo.findOne({
            where: {
                email: email,
            }
        });
    }

    async findByIdAndEmail(id?: number, email?: string): Promise<AdminEntity[]> {
      const query = this.adminRepo.createQueryBuilder('admin');
    
      if (id) {
        query.andWhere('admin.id = :id', { id });
      }
      if (email) {
        query.andWhere('admin.email = :email', { email });
      }
    
      return query.getMany();
    }

    async createAdmin(myobj: AuthDTO): Promise<any> {
      
      const userEmail = await this.adminRepo.findOne({where: { email: myobj.email }});
      if (userEmail) {
        throw new BadRequestException('This email is already used!');
      }
      const admin= new AdminEntity();
      admin.email = myobj.email;
      admin.password = myobj.password; 

      const profile = new AdminProfile();
      await this.adminProfileRepo.save(profile);
      console.log("admin create");
      admin.adminProfile = profile;
      console.log("admin profile create");
      return await this.adminRepo.save(admin);
    }

    async findByCredentials(loginDto: AuthDTO): Promise<any> {
      return this.adminRepo.findOne({ where: { email:loginDto.email } });
    }

    // async findLoginData( logindata:LoginDTO): Promise<any> {
    //     return await this.adminRepo.findOneBy({email:logindata.email});
    // }
  
    // async getAdminWithProfile(id: number): Promise<AdminEntity> {
    //   return this.adminRepo.findOne({ where: { id }, relations: ['adminProfile'] });
    // }

    async getAllAdminWithProfile(): Promise<AdminEntity[]> {
      return this.adminRepo.find({ relations: ['adminProfile'] });
    }

    async getAdminData(adminId: number): Promise<AdminDTO> {
      const admin = await this.adminRepo.findOne({ where: { id: adminId },relations: ['adminProfile'] ,
        select: {id: true, email: true, adminProfile: {admin_filename: true},}  });
      if (!admin) {
          throw new NotFoundException('Admin not found');
      }
      return admin;
    }

    async getAdminWithProfileByAdminId(adminId: number): Promise<AdminEntity> {
      const admin = await this.adminRepo.findOne({ where: { id: adminId }, relations: ['adminProfile'] });
      if (!admin) {
          throw new NotFoundException('Admin not found');
      }
      return admin;
    }
  

    async changeAdminPassword(id: number, changePasswordDto: changePasswordDTO): Promise<string> {
      const user = await this.adminRepo.findOne({ where: { id } });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const isMatch = await bcrypt.compare(changePasswordDto.oldpassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Old password does not match');
      }
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(changePasswordDto.newpassword, salt);
      user.password = hashedPassword;
  
      await this.adminRepo.save(user);
      return 'Password changed successfully';
    }

    // async updatePassword(id: number, newPassword: string): Promise<void> {
    //   await this.adminRepo.update(id, { password: newPassword });
    // }
  
    // async updateAdmin(id: number, adminProfileDto: AdminUpdateDTO): Promise<any> {
    //   // await this.adminRepo.update(id, updatedAdmin);
    //   adminProfile.adminEntity = await this.adminRepo.findOne({ where: { id } });
    //   await this.adminProfileRepo.save(adminProfile);
    //   return this.adminRepo.findOne({ where: { id }, relations: ['adminProfile'] });
    // }

    async updateAdmin(id: number, adminProfileDto: AdminUpdateDTO): Promise<any> {
      const user = await this.adminRepo.findOne({
        where: { id },
        relations: ['adminProfile'],
      });
  
      if (!user) {
        throw new NotFoundException('Admin not found');
      }
  
      // Update AdminEntity fields if needed
      // Example: user.email = adminProfileDto.email; 
  
      // Update AdminProfile fields
      // if (user.adminProfile) {
        user.adminProfile.admin_name = adminProfileDto.admin_name;
        user.adminProfile.admin_NID = adminProfileDto.admin_NID;
        user.adminProfile.admin_phone = adminProfileDto.admin_phone;
        user.adminProfile.admin_gender = adminProfileDto.admin_gender;
        user.adminProfile.admin_address = adminProfileDto.admin_address;
  
        // Save updated profile
        await this.adminProfileRepo.save(user.adminProfile);
      // } else {
      //   // Create a new profile if it doesn't exist
      //   const newProfile = this.adminProfileRepo.create(adminProfileDto);
      //   user.adminProfile = newProfile;
      //   await this.adminRepo.save(user);
      // }
  
      return user;
    }

    async updateDOB(id: number, adminProfileDto: AdminUpdateDateDTO): Promise<any> {
      const user = await this.adminRepo.findOne({
        where: { id },
        relations: ['adminProfile'], 
      });
  
      if (!user) {
        throw new NotFoundException('Admin not found');
      }
  
      // Update AdminProfile fields
        user.adminProfile.admin_DOB = adminProfileDto.admin_DOB;
        // Save updated profile
        await this.adminProfileRepo.save(user.adminProfile);
  
      return user;
    }

    async updateAdminProfileImage(id: number, adminProfileDto: AdminProfileDTO): Promise<any> {
      const user = await this.adminRepo.findOne({
        where: { id },
        relations: ['adminProfile'],
      });
  
      if (!user || !user.adminProfile) {
        throw new NotFoundException('Admin or profile not found');
      }
  
      // Update the profile image filename
      user.adminProfile.admin_filename = adminProfileDto.admin_filename;
      await this.adminProfileRepo.save(user.adminProfile);
  
      return { message: 'Profile image updated successfully', admin_filename: user.adminProfile.admin_filename };
    }

    async getAdminProfileImage(id: number): Promise<string> {
      const admin = await this.adminRepo.findOne({
          where: { id },
          relations: ['adminProfile'],
          select: {
            adminProfile: {
              admin_filename: true
            },
          },
      });
  
      if (!admin || !admin.adminProfile) {
          throw new NotFoundException('Admin or profile not found');
      }
  
      return admin.adminProfile.admin_filename;
    } 
  

    //event-coordinator

    // async addCoordinator(id: number, evt_co: Event_CoordinatorEntity): Promise<Event_CoordinatorEntity> {
    //   //console.log(id);
    //   //console.log(manager);
    //   const admin = await this.adminRepo.findOneBy({id: id});
    //    evt_co.admin = admin;
    //   return this.eventCoordinatorRepo.save(evt_co);
    // }

    async addCoordinator(id: number, myobj: Event_CoordinatorEntity): Promise<Event_CoordinatorEntity> {
      // Find the admin by ID
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
          throw new NotFoundException('Admin not found');
      }
  
      // Set the admin reference
      myobj.admin = admin;
  
      // Check if profile exists, if not create a new one
      if (!myobj.event_coordinatorProfile) {
          const profile = new Event_CoordinatorProfile();
          profile.event_coordinator_name = myobj.name;
          profile.event_coordinator_NID = 'N/A'; // Default value or from request body
          profile.event_coordinator_DOB = new Date(); // Default or from request body
          profile.event_coordinator_phone = 'N/A'; // Default or from request body
          profile.event_coordinator_gender = 'N/A'; // Default or from request body
          profile.event_coordinator_address = 'N/A'; // Default or from request body
          profile.event_coordinator_file = 'N/A'; // Default or from request body
  
          // Save the new profile and associate it with the event coordinator
          myobj.event_coordinatorProfile = await this.eventCoordinatorProfileRepo.save(profile);
      }
  
      // Save the event coordinator entity
      return this.eventCoordinatorRepo.save(myobj);
    }

  // getUsersWithAdmin(): Promise<AdminEntity[]> {
  //     return this.adminRepo.find({relations: ["users"]});
  // }

  // getUsersWithid(id: number): Promise<AdminEntity[]> {
  //     return this.adminRepo.find({relations: ["users"], where:{id:id}});
  // }

  // getUsersWithAdminEmail(email: string): Promise<AdminEntity[]> {
  //     return this.adminRepo.find({relations: ["users"], where:{email:email}});
  // }

  async getAllAdminsWithCoordinators(): Promise<AdminEntity[]> {
      return this.adminRepo.find({ relations: ['evt_co'],
          select: {
                id: true,
                email: true,
                evt_co: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
       });
  }

  async getCoordinatorById(id: number): Promise<Event_CoordinatorEntity> {
      return this.eventCoordinatorRepo.findOne({ where: { id }, relations: ['admin'], select: {
          admin: {
            id: true,
            email: true,
          },
        }, });
  }

  // async getCoordinatorProfile(adminId: number, coordinatorId: number): Promise<Event_CoordinatorEntity[]> {
  //   // Check if the admin exists
  //   const admin = await this.adminRepo.findOne({ where: { id: adminId } });
  //   if (!admin) {
  //     throw new NotFoundException(`Admin with ID ${adminId} not found`);
  //   }

  //   // Fetch the event coordinator with profile details
  //   const coordinator = await this.eventCoordinatorRepo.find({
  //     where: { id: coordinatorId, admin: { id: adminId } },
  //     relations: ['event_coordinatorProfile'], // Include profile details
  //     select: {
  //       admin: {
  //         evt_co: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           event_coordinatorProfile: {
  //             event_coordinator_PID: true,
  //             event_coordinator_NID: true,
  //             event_coordinator_phone: true,
  //             event_coordinator_DOB: true,
  //             event_coordinator_gender: true,
  //             event_coordinator_address: true,
  //             event_coordinator_file: true,
  //             creationDate: true,
  //           },
  //         },
  //       },
  //     },
  //   });
  //   if (!coordinator) {
  //     throw new NotFoundException(`Event Coordinator with ID ${coordinatorId} not found`);
  //   }

  //   return coordinator;
  // }

  // async getCoordinatorProfile(adminId: number, coordinatorId: number): Promise<Event_CoordinatorEntity[]> {
  //   // Check if the admin exists
  //   const admin = await this.adminRepo.findOne({ where: { id: adminId } });
  //   if (!admin) {
  //     throw new NotFoundException(`Admin with ID ${adminId} not found`);
  //   }
  
  //   // Fetch the coordinator details with selected properties
  //   return this.eventCoordinatorRepo.find({
  //     where: { id: coordinatorId, admin: { id: adminId } },
  //     relations: ['event_coordinatorProfile'], // Include related profile details
  //     select: {
  //       id: true,
  //       name: true,
  //       email: true,
  //       event_coordinatorProfile: {
  //         event_coordinator_PID: true,
  //         event_coordinator_NID: true,
  //         event_coordinator_phone: true,
  //         event_coordinator_DOB: true,
  //         event_coordinator_gender: true,
  //         event_coordinator_address: true,
  //         event_coordinator_file: true,
  //         creationDate: true,
  //       },
  //     },
  //   });
  // }
  
  async getCoordinatorProfile(coordinatorId: number): Promise<Event_CoordinatorEntity[]> {
  
    // Fetch the coordinator details with selected properties
    return this.eventCoordinatorRepo.find({
      where: { id: coordinatorId },
      relations: ['event_coordinatorProfile'], // Include related profile details
      select: {
        id: true,
        name: true,
        email: true,
        event_coordinatorProfile: {
          event_coordinator_PID: true,
          event_coordinator_NID: true,
          event_coordinator_phone: true,
          event_coordinator_DOB: true,
          event_coordinator_gender: true,
          event_coordinator_address: true,
          event_coordinator_file: true,
          creationDate: true,
        },
      },
    });
  }

  // async updateEventCoordinator(
  //   adminId: number,
  //   eventCoordinatorId: number,
  //   updateData: Partial<Event_CoordinatorEntity & Event_CoordinatorProfile>
  // ): Promise<Event_CoordinatorEntity> {
  //   // Check if admin exists
  //   const admin = await this.adminRepo.findOne({ where: { id: adminId } });
  //   if (!admin) {
  //     throw new NotFoundException(`Admin with ID ${adminId} not found`);
  //   }
  
  //   // Check if the event coordinator exists
  //   const eventCoordinator = await this.eventCoordinatorRepo.findOne({
  //     where: { id: eventCoordinatorId, admin: { id: adminId } },
  //     relations: ['event_coordinatorProfile'], // Include the profile in the query
  //   });
  //   if (!eventCoordinator) {
  //     throw new NotFoundException(`Event Coordinator with ID ${eventCoordinatorId} not found`);
  //   }
  
  //   // Update event coordinator fields
  //   Object.assign(eventCoordinator, updateData);
  
  //   // Update profile if data is provided
  //   if (eventCoordinator.event_coordinatorProfile) {
  //     Object.assign(eventCoordinator.event_coordinatorProfile, updateData);
      
  //     // Save updated profile
  //     await this.eventCoordinatorProfileRepo.save(eventCoordinator.event_coordinatorProfile);
  //   }
  
  //   // Save updated event coordinator entity
  //   return this.eventCoordinatorRepo.save(eventCoordinator);
  // }
  

  async updateEventCoordinator(
    eventCoordinatorId: number,
    updateData: Partial<Event_CoordinatorEntity & Event_CoordinatorProfile>
  ): Promise<Event_CoordinatorEntity> {
    // Check if the event coordinator exists
    const eventCoordinator = await this.eventCoordinatorRepo.findOne({
      where: { id: eventCoordinatorId},
      relations: ['event_coordinatorProfile'], // Include the profile in the query
    });
    if (!eventCoordinator) {
      throw new NotFoundException(`Event Coordinator with ID ${eventCoordinatorId} not found`);
    }
  
    // Update event coordinator fields
    Object.assign(eventCoordinator, updateData);
  
    // Update profile if data is provided
    if (eventCoordinator.event_coordinatorProfile) {
      Object.assign(eventCoordinator.event_coordinatorProfile, updateData);
      
      // Save updated profile
      await this.eventCoordinatorProfileRepo.save(eventCoordinator.event_coordinatorProfile);
    }
  
    // Save updated event coordinator entity
    return this.eventCoordinatorRepo.save(eventCoordinator);
  }

  async updateEventCoordinatorProfileImage(
    coordinatorId: number,
    eventCoordinatorProfileDto: Partial<Event_CoordinatorProfile>,
  ): Promise<any> {
      // Find the event coordinator along with their profile
      const eventCoordinator = await this.eventCoordinatorRepo.findOne({
          where: { id: coordinatorId },
          relations: ['event_coordinatorProfile'],
      });

      if (!eventCoordinator || !eventCoordinator.event_coordinatorProfile) {
          throw new NotFoundException('Event Coordinator or profile not found');
      }

      // Update the profile image filename
      eventCoordinator.event_coordinatorProfile.event_coordinator_file = eventCoordinatorProfileDto.event_coordinator_file;
      await this.eventCoordinatorProfileRepo.save(eventCoordinator.event_coordinatorProfile);

      return {
          message: 'Profile image updated successfully',
          event_coordinator_file: eventCoordinator.event_coordinatorProfile.event_coordinator_file,
      };
  }

  // async deleteCoordinator(id: number): Promise<void> {
  //     await this.eventCoordinatorRepo.delete(id);
  // }

  async deleteAdmin(id: number): Promise<void> {
    const admin = await this.adminRepo.findOne({ where: { id }, relations: ['adminProfile'] });
    
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  
    await this.adminRepo.remove(admin); // This will also delete the associated profile due to cascade
  }

  async deleteCoordinator(id: number): Promise<void> {
    const coordinator = await this.eventCoordinatorRepo.findOne({ where: { id }, relations: ['event_coordinatorProfile'] });
    
    if (!coordinator) {
      throw new NotFoundException(`Event Coordinator with ID ${id} not found`);
    }
  
    await this.eventCoordinatorRepo.remove(coordinator); // This will also delete the associated profile due to cascade
  }


  //Judge

  async createJudge(myobj: AuthDTO): Promise<any> {
    const userEmail = await this.judgeRepo.findOne({where: { email: myobj.email }});
    if (userEmail) {
      throw new BadRequestException('This email is already used!');
    }
    const judge= new JudgeEntity();
    judge.email = myobj.email;
    judge.password = myobj.password; 

    const profile = new JudgeProfile();
    await this.judgeProfileRepo.save(profile);
    
    judge.judgeProfile = profile;
    return await this.judgeRepo.save(judge);
  }

  async getAllJudge(): Promise<JudgeEntity[]> {
    return await this.judgeRepo.find();
  }

  async  getJudgeById(id:number): Promise<JudgeEntity> {
      return await this.judgeRepo.findOne({
          where: {
              id: id,
          }
      });
  }

  async getJudgeProfile(judgeId: number): Promise<JudgeDTO[]> {
  
    // Fetch the judge details with selected properties
    return this.judgeRepo.find({
      where: { id: judgeId },
      relations: ['judgeProfile'], // Include related profile details
      select: {
        id: true,
        email: true,
        judgeProfile: {
          judge_PID: true,
          judge_name: true,
          judge_NID: true,
          judge_phone: true,
          judge_DOB: true,
          judge_gender: true,
          judge_address: true,
          judge_filename: true,
          creationDate: true,
        },
      },
    });
  }

  async updateJudge(judgeId: number, judgeProfileDto: JudgeUpdateDTO): Promise<any> {
    const judge = await this.judgeRepo.findOne({
      where: { id: judgeId },
      relations: ['judgeProfile'],
    });

    if (!judge) {
      throw new NotFoundException('Judge not found');
    }

    Object.assign(judge.judgeProfile, judgeProfileDto);

    await this.judgeProfileRepo.save(judge.judgeProfile);

    return judge;
  }

  async updateJudgeProfileImage(id: number, judgeProfileDto: JudgeProfileDTO): Promise<any> {
    const user = await this.judgeRepo.findOne({
      where: { id },
      relations: ['judgeProfile'],
    });

    if (!user || !user.judgeProfile) {
      throw new NotFoundException('Judge or profile not found');
    }

    // Update the profile image filename
    user.judgeProfile.judge_filename = judgeProfileDto.judge_file;
    await this.judgeProfileRepo.save(user.judgeProfile);

    return { message: 'Profile image updated successfully', judge_filename: user.judgeProfile.judge_filename };
  }

  async getJudgeProfileImage(id: number): Promise<string> {
    const judge = await this.judgeRepo.findOne({
        where: { id },
        relations: ['judgeProfile'],
    });

    if (!judge || !judge.judgeProfile) {
        throw new NotFoundException('Judge or profile not found');
    }

    return judge.judgeProfile.judge_filename;
  }
  
  
  //Entrepreneur

  async createEntrepreneur(myobj: AuthDTO): Promise<any> {
    const userEmail = await this.entrepreneurRepo.findOne({where: { email: myobj.email }});
    if (userEmail) {
      throw new BadRequestException('This email is already used!');
    }
    const entrepreneur= new EntrepreneurEntity();
    entrepreneur.email = myobj.email;
    entrepreneur.password = myobj.password; 

    const profile = new EntrepreneurProfile();
    await this.entrepreneurProfileRepo.save(profile);
    
    entrepreneur.entrepreneurProfile = profile;
    return await this.judgeRepo.save(entrepreneur);
  }

  async getAllEntrepreneur(): Promise<EntrepreneurEntity[]> {
    return await this.entrepreneurRepo.find();
  }

  async  getEntrepreneurById(id:number): Promise<EntrepreneurEntity> {
      return await this.entrepreneurRepo.findOne({
          where: {
              id: id,
          }
      });
  }

  async getEntrepreneurProfile(entrepreneurId: number): Promise<EntrepreneurDTO[]> {
  
    // Fetch the judge details with selected properties
    return this.entrepreneurRepo.find({
      where: { id: entrepreneurId },
      relations: ['entrepreneurProfile'], // Include related profile details
      select: {
        id: true,
        email: true,
        entrepreneurProfile: {
          entrepreneur_PID: true,
          entrepreneur_name: true,
          entrepreneur_NID: true,
          entrepreneur_phone: true,
          entrepreneur_DOB: true,
          entrepreneur_gender: true,
          entrepreneur_address: true,
          entrepreneur_filename: true,
          creationDate: true,
        },
      },
    });
  }

  async updateEntrepreneur(entrepreneurId: number, entrepreneurProfileDto: EntrepreneurProfileDTO): Promise<any> {
    const entrepreneur = await this.entrepreneurRepo.findOne({
      where: { id: entrepreneurId },
      relations: ['entrepreneurProfile'],
    });

    if (!entrepreneur) {
      throw new NotFoundException('Entrepreneur not found');
    }

    Object.assign(entrepreneur.entrepreneurProfile, entrepreneurProfileDto);

    await this.entrepreneurProfileRepo.save(entrepreneur.entrepreneurProfile);

    return entrepreneur;
  }

  async updateEntrepreneurProfileImage(id: number, entrepreneurProfileDto: EntrepreneurProfileDTO): Promise<any> {
    const user = await this.entrepreneurRepo.findOne({
      where: { id },
      relations: ['entrepreneurProfile'],
    });

    if (!user || !user.entrepreneurProfile) {
      throw new NotFoundException('Entrepreneur or profile not found');
    }

    // Update the profile image filename
    user.entrepreneurProfile.entrepreneur_filename = entrepreneurProfileDto.entrepreneur_file;
    await this.entrepreneurProfileRepo.save(user.entrepreneurProfile);

    return { message: 'Profile image updated successfully', entrepreneur_filename: user.entrepreneurProfile.entrepreneur_filename };
  }

  async getEntrepreneurProfileImage(id: number): Promise<string> {
    const entrepreneur = await this.entrepreneurRepo.findOne({
        where: { id },
        relations: ['entrepreneurProfile'],
    });

    if (!entrepreneur || !entrepreneur.entrepreneurProfile) {
        throw new NotFoundException('Entrepreneur or profile not found');
    }

    return entrepreneur.entrepreneurProfile.entrepreneur_filename;
  } 

}
