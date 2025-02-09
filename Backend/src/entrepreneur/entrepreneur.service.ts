import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntrepreneurEntity } from "./entrepreneur.entity";
import { Repository } from "typeorm";
import { EntrepreneurProfile } from "./entrepreneur.profile";
import { AuthDTO } from "src/auth/dto/auth.dto";
import { changePasswordDTO } from "src/auth/dto/chnage-password.dto";
import * as bcrypt from 'bcrypt'; 
import { EntrepreneurProfileDTO } from "./entrepreneur.dto";
import { IdeaDTO } from "src/idea/idea.dto";
import { IdeaEntity } from "src/idea/idea.entity";
import { PrototypeEntity } from "src/prototype/prototype.entity";
import { PresentationEntity } from "src/presentation/presentation.entity";
import { InvestmentEntity } from "src/investment/investment.entity";
import { SeekingEntity } from "src/presentation/seeking.entity";
import { EventEntity } from "src/event/event.entity";
import { PrototypeDTO } from "src/prototype/prototype.dto";
import { PresentationDTO, SeekingDTO } from "src/presentation/presentation.dto";

@Injectable()
export class EntrepreneurService {
  constructor(
    @InjectRepository(EntrepreneurEntity)
    private readonly entrepreneurRepo: Repository<EntrepreneurEntity>, 
    @InjectRepository(EntrepreneurProfile) 
    private readonly entrepreneurProfileRepo: Repository<EntrepreneurProfile>,
    @InjectRepository(IdeaEntity) 
    private readonly ideaRepo: Repository<IdeaEntity>,
    @InjectRepository(PrototypeEntity) 
    private readonly prototypeRepo: Repository<PrototypeEntity>,
    @InjectRepository(PresentationEntity) 
    private readonly presentationRepo: Repository<PresentationEntity>,
    @InjectRepository(InvestmentEntity) 
    private readonly investmentRepo: Repository<InvestmentEntity>,
    @InjectRepository(SeekingEntity) 
    private readonly seekingRepo: Repository<SeekingEntity>,
    @InjectRepository(EventEntity) 
    private readonly eventRepo: Repository<EventEntity>,
  ) { }

    // findByEmail(email: string) {
    //   throw new Error('Method not implemented.');
    // }

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

    async  getEntrepreneurByEmail(email:string): Promise<EntrepreneurEntity> {
        return await this.entrepreneurRepo.findOne({
            where: {
                email: email,
            }
        });
    }

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
      return await this.entrepreneurRepo.save(entrepreneur);
    }

    async findByCredentials(loginDto: AuthDTO): Promise<any> {
        return this.entrepreneurRepo.findOne({ where: { email:loginDto.email } });
      }

    async changeEntrepreneurPassword(id: number, changePasswordDto: changePasswordDTO): Promise<string> {
    const user = await this.entrepreneurRepo.findOne({ where: { id } });

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

    await this.entrepreneurRepo.save(user);
    return 'Password changed successfully';
    }

    async updateEntrepreneur(id: number, ProfileDto: EntrepreneurProfileDTO): Promise<any> {
      const user = await this.entrepreneurRepo.findOne({
        where: { id },
        relations: ['entrepreneurProfile'],
      });
  
      if (!user) {
        throw new NotFoundException('Entrepreneur Profile not found');
      }
  
        user.entrepreneurProfile.entrepreneur_name = ProfileDto.entrepreneur_name;
        user.entrepreneurProfile.entrepreneur_NID = ProfileDto.entrepreneur_NID;
        user.entrepreneurProfile.entrepreneur_phone = ProfileDto.entrepreneur_phone;
        user.entrepreneurProfile.entrepreneur_gender = ProfileDto.entrepreneur_gender;
        user.entrepreneurProfile.entrepreneur_address = ProfileDto.entrepreneur_address;
        user.entrepreneurProfile.entrepreneur_DOB = ProfileDto.entrepreneur_DOB;
  
        await this.entrepreneurProfileRepo.save(user.entrepreneurProfile);
      return user;
    }

    async updateProfileImage(id: number, judgeProfileDto: EntrepreneurProfileDTO): Promise<any> {
      const user = await this.entrepreneurRepo.findOne({
        where: { id },
        relations: ['entrepreneurProfile'],
      });
  
      if (!user || !user.entrepreneurProfile) {
        throw new NotFoundException('Entrepreneur Profile not found');
      }
  
      // Update the profile image filename
      user.entrepreneurProfile.entrepreneur_filename = judgeProfileDto.entrepreneur_file;
      await this.entrepreneurProfileRepo.save(user.entrepreneurProfile);
  
      return { message: 'Profile image updated successfully', entrepreneur_filename: user.entrepreneurProfile.entrepreneur_filename };
    }

    async getProfileImage(id: number): Promise<string> {
      const entrepreneur = await this.entrepreneurRepo.findOne({
          where: { id },
          relations: ['entrepreneurProfile'],
      });
  
      if (!entrepreneur || !entrepreneur.entrepreneurProfile) {
          throw new NotFoundException('Entrepreneur Profile not found');
      }
  
      return entrepreneur.entrepreneurProfile.entrepreneur_filename;
    } 

    async deleteEntrepreneur(id: number): Promise<void> {
      const entrepreneur = await this.entrepreneurRepo.findOne({ where: { id }, relations: ['entrepreneurProfile'] });
      
      if (!entrepreneur) {
        throw new NotFoundException(`Entrepreneur with ID ${id} not found`);
      }
    
      await this.entrepreneurRepo.remove(entrepreneur); // This will also delete the associated profile due to cascade
    }

    // Idea

    async addIdea(id: number, myobj: IdeaEntity): Promise<IdeaEntity> {
      // Find the entrepreneur by ID
      const entrepreneur = await this.entrepreneurRepo.findOne({ where: { id } });
      if (!entrepreneur) {
          throw new NotFoundException('Entrepreneur not found');
      }
  
      // Set the entrepreneur reference
      myobj.entrepreneur = entrepreneur;
  
      // Check and initialize PrototypeEntity if not present
      if (!myobj.prototype) {
          const prototype = new PrototypeEntity();
          prototype.name = 'N/A';
          prototype.filename = 'N/A';
          prototype.date = new Date();
          prototype.description = 'N/A';
          myobj.prototype = await this.prototypeRepo.save(prototype);
      }
  
      // Check and initialize PresentationEntity if not present
      if (!myobj.presentation) {
          const presentation = new PresentationEntity();
          presentation.status = 'N/A';
          presentation.date = new Date();
  
          // Save the presentation and associate it with the idea
          myobj.presentation = await this.presentationRepo.save(presentation);
  
          // Check if seeking entries are provided in the request
          if (myobj.presentation.seekings && myobj.presentation.seekings.length > 0) {
              // Initialize and save each SeekingEntity
              for (const seekingData of myobj.presentation.seekings) {
                  const seeking = new SeekingEntity();
                  seeking.pid = presentation.pid; // Associate with presentation ID
                  seeking.seeking = seekingData.seeking; // Use provided seeking text
  
                  // Save each seeking and associate it with the presentation
                  await this.seekingRepo.save(seeking);
              }
          }
      }
  
      // Check and initialize InvestmentEntity if not present
      if (!myobj.invest) {
          const investment = new InvestmentEntity();
          investment.amount = 0;
          investment.description = 'N/A';
          investment.date = new Date();
          myobj.invest = await this.investmentRepo.save(investment);
      }
  
      // Assign an EventEntity if specified
      if (myobj.event) {
          const event = await this.eventRepo.findOne({ where: { eid: myobj.event.eid } });
          if (!event) {
              throw new NotFoundException('Event not found');
          }
          myobj.event = event;
      }
  
      // Save the idea entity with all relations
      return this.ideaRepo.save(myobj);
  }
  
  async getIdeaById(id: number): Promise<IdeaDTO> {
    const idea = await this.ideaRepo.findOne({
        where: { id },
        relations: ['prototype', 'presentation', 'invest', 'event', 'entrepreneur'],
    });
    if (!idea) {
        throw new NotFoundException('Idea not found');
    }
    return idea;
  } 

  async getAllIdeas(): Promise<IdeaDTO[]> {
    return this.ideaRepo.find({
        relations: ['prototype', 'presentation', 'invest', 'event', 'entrepreneur'],
    });
  }

  async updateIdea(id: number, updateData: IdeaDTO): Promise<IdeaDTO> {
    const idea = await this.ideaRepo.findOne({ where: { id } });
    if (!idea) {
        throw new NotFoundException('Idea not found');
    }

    Object.assign(idea, updateData); // Update the idea with provided data
    return this.ideaRepo.save(idea);
  }

  async deleteIdea(id: number): Promise<void> {
    const idea = await this.ideaRepo.findOne({ where: { id } });
    if (!idea) {
        throw new NotFoundException('Idea not found');
    }
    await this.ideaRepo.remove(idea);
  }

  async getPrototypeById(ideaId: number): Promise<PrototypeDTO> {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId }, relations: ['prototype'] });
    if (!idea || !idea.prototype) {
        throw new NotFoundException('Prototype not found for this idea');
    }
    return idea.prototype;
  }

  async updatePrototype(ideaId: number, updateData: PrototypeDTO): Promise<PrototypeDTO> {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId }, relations: ['prototype'] });
    if (!idea || !idea.prototype) {
        throw new NotFoundException('Prototype not found for this idea');
    }

    Object.assign(idea.prototype, updateData); // Update prototype properties
    return this.prototypeRepo.save(idea.prototype);
  }

  async deletePrototype(ideaId: number): Promise<void> {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId }, relations: ['prototype'] });
    if (!idea || !idea.prototype) {
        throw new NotFoundException('Prototype not found for this idea');
    }

    await this.prototypeRepo.remove(idea.prototype);
  }

  async getPresentationById(ideaId: number): Promise<PresentationDTO> {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId }, relations: ['presentation'] });
    if (!idea || !idea.presentation) {
        throw new NotFoundException('Presentation not found for this idea');
    }
    return idea.presentation;
  }

  async updatePresentation(ideaId: number, updateData: PresentationDTO): Promise<PresentationDTO> {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId }, relations: ['presentation'] });
    if (!idea || !idea.presentation) {
        throw new NotFoundException('Presentation not found for this idea');
    }

    Object.assign(idea.presentation, updateData); // Update presentation properties
    return this.presentationRepo.save(idea.presentation);
  }

  async deletePresentation(ideaId: number): Promise<void> {
    const idea = await this.ideaRepo.findOne({ where: { id: ideaId }, relations: ['presentation'] });
    if (!idea || !idea.presentation) {
        throw new NotFoundException('Presentation not found for this idea');
    }

    await this.presentationRepo.remove(idea.presentation);
  }

  async getSeekingById(seekingId: number): Promise<SeekingDTO> {
    const seeking = await this.seekingRepo.findOne({ where: { pid: seekingId } });
    if (!seeking) {
        throw new NotFoundException('Seeking entry not found');
    }
    return seeking;
  }

  async getAllSeekings(): Promise<SeekingDTO[]> {
    return this.seekingRepo.find();
  }

  async updateSeeking(seekingId: number, updateData: SeekingDTO): Promise<SeekingDTO> {
    const seeking = await this.seekingRepo.findOne({ where: { pid: seekingId } });
    if (!seeking) {
        throw new NotFoundException('Seeking entry not found');
    }

    Object.assign(seeking, updateData); // Update seeking properties
    return this.seekingRepo.save(seeking);
  }

  async deleteSeeking(seekingId: number): Promise<void> {
    const seeking = await this.seekingRepo.findOne({ where: { pid: seekingId } });
    if (!seeking) {
        throw new NotFoundException('Seeking entry not found');
    }

    await this.seekingRepo.remove(seeking);
  }

  async newSeeking(presentationId: number, seekingData: SeekingEntity): Promise<SeekingEntity> {
    // Find the presentation by ID
    const presentation = await this.presentationRepo.findOne({ where: { pid: presentationId } });
    if (!presentation) {
        throw new NotFoundException('Presentation not found');
    }

    // Create and associate the new seeking
    const seeking = new SeekingEntity();
    seeking.pid = presentationId; // Set the presentation ID as part of the composite key
    seeking.seeking = seekingData.seeking;
    seeking.presentation = presentation;

    return this.seekingRepo.save(seeking);
  }

}