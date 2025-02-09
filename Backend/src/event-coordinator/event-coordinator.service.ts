import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event_CoordinatorEntity } from './event-coordinator.entity';
import { AuthDTO } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt'; 
import { EventEntity } from '../event/event.entity';
import { EventCoordinatorProfileDTO, UpdateEventCoordinatorDTO } from './event-coordinator.dto';
import { Event_CoordinatorProfile } from './event-coordinator.profile';
import { changePasswordDTO } from 'src/auth/dto/chnage-password.dto';
import { EventDTO } from 'src/event/event.dto';


@Injectable()
export class EventCoordinatorService {
  constructor(
    @InjectRepository(Event_CoordinatorEntity)
    private readonly eventCoordinatorRepository: Repository<Event_CoordinatorEntity>,
    @InjectRepository(Event_CoordinatorProfile)
    private readonly eventCoordinatorProfileRepo: Repository<Event_CoordinatorProfile>,
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async findByCredentials(loginDto: AuthDTO): Promise<any> {
    return this.eventCoordinatorRepository.findOne({ where: { email:loginDto.email } });
  }

//   async create(eventCoordinatorData: Partial<Event_CoordinatorEntity>): Promise<Event_CoordinatorEntity> {
//     const eventCoordinator = this.eventCoordinatorRepository.create(eventCoordinatorData);
//     return this.eventCoordinatorRepository.save(eventCoordinator);
//   }

  async findAll(): Promise<Event_CoordinatorEntity[]> {
    return this.eventCoordinatorRepository.find();
  }

  async findOne(id: number): Promise<Event_CoordinatorEntity> {
    return this.eventCoordinatorRepository.findOneBy({ id });
  }

  // async update(id: number, eventCoordinatorData: Partial<Event_CoordinatorEntity>): Promise<Event_CoordinatorEntity> {
  //   await this.eventCoordinatorRepository.update(id, eventCoordinatorData);
  //   return this.findOne(id);
  // }

  async updateCoordinator(id: number, ProfileDto: UpdateEventCoordinatorDTO): Promise<any> {
    const user = await this.eventCoordinatorRepository.findOne({
      where: { id },
      relations: ['event_coordinatorProfile'],
    });

    if (!user) {
      throw new NotFoundException('Event-Coordinator not found');
    }

    // Update AdminEntity fields if needed
    Object.assign(user, ProfileDto);

    // Update AdminProfile fields
    Object.assign(user.event_coordinatorProfile, ProfileDto);

      // Save updated profile
      await this.eventCoordinatorProfileRepo.save(user.event_coordinatorProfile);
    // } else {
    //   // Create a new profile if it doesn't exist
    //   const newProfile = this.adminProfileRepo.create(adminProfileDto);
    //   user.adminProfile = newProfile;
    //   await this.adminRepo.save(user);
    // }

    return this.eventCoordinatorRepository.save(user);
  }

  async updateProfileImage(id: number, ProfileDto: EventCoordinatorProfileDTO): Promise<any> {
    const user = await this.eventCoordinatorRepository.findOne({
      where: { id },
      relations: ['event_coordinatorProfile'],
    });

    if (!user || !user.event_coordinatorProfile) {
      throw new NotFoundException('Event-Coordinator profile not found');
    }

    // Update the profile image filename
    user.event_coordinatorProfile.event_coordinator_file = ProfileDto.event_coordinator_file;
    await this.eventCoordinatorProfileRepo.save(user.event_coordinatorProfile);

    return { message: 'Profile image updated successfully', event_coordinator_file: user.event_coordinatorProfile.event_coordinator_file };
  }

  async getProfileImage(id: number): Promise<string> {
    const event_coordinator = await this.eventCoordinatorRepository.findOne({
        where: { id },
        relations: ['event_coordinatorProfile'],
    });

    if (!event_coordinator || !event_coordinator.event_coordinatorProfile) {
        throw new NotFoundException('Event-Coordinator profile not found');
    }

    return event_coordinator.event_coordinatorProfile.event_coordinator_file;
  }

  async changeEventCoordinatorPassword(
    eventCoordinatorId: number,
    changePasswordDto: changePasswordDTO
  ): Promise<any> {
    // Find the event coordinator by ID
    const eventCoordinator = await this.eventCoordinatorRepository.findOne({
      where: { id: eventCoordinatorId },
    });
  
    if (!eventCoordinator) {
      throw new NotFoundException(`Event Coordinator with ID ${eventCoordinatorId} not found`);
    }
  
    // Compare old password with the stored password
    const isPasswordMatching = await bcrypt.compare(changePasswordDto.oldpassword, eventCoordinator.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Old password is incorrect');
    }
  
    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.newpassword, salt);
  
    // Update the password and save
    eventCoordinator.password = hashedPassword;
    await this.eventCoordinatorRepository.save(eventCoordinator);
  
    return { message: 'Password successfully changed' };
  }

  async getAdminProfileImage(id: number): Promise<string> {
    const event_coordinator = await this.eventCoordinatorRepository.findOne({
        where: { id },
        relations: ['event_coordinatorProfile'],
    });

    if (!event_coordinator || !event_coordinator.event_coordinatorProfile) {
        throw new NotFoundException('Event-Coordinator profile not found');
    }

    return event_coordinator.event_coordinatorProfile.event_coordinator_file;
  } 

  async remove(id: number): Promise<void> {
    await this.eventCoordinatorRepository.delete(id);
  }

  //Event

  async addEvent(id: number, events: EventEntity): Promise<EventEntity> {
      const eventCoordinator = await this.eventCoordinatorRepository.findOneBy({id: id});
       events.eventCoordinator = eventCoordinator;
      return this.eventRepo.save(events);
    }

  async getAllEvents(): Promise<EventDTO[]> {
    return this.eventRepo.find(
      {select: {
        eid: true,
        name: true,
        date: true,
        location: true,
        description: true,}}
    ); // fetch all events without filtering by ID
  }

  async getAllEventsWithCoordinators(): Promise<Event_CoordinatorEntity[]> {
    return this.eventCoordinatorRepository.find({ relations: ['events'],
        select: {
              id: true,
              name: true,
              events: {
                eid: true,
                name: true,
                description: true,
                date: true,
                location: true,
              },
            },
    });
  }

  async getEventById(eid: number): Promise<EventEntity> {
      return this.eventRepo.findOne({ where: { eid }, select: {
            eid: true,
            name: true,
            date: true,
            description: true,
          
        }, });
  }
  

  async updateEvent(
    coordinatorId: number,
    eventId: number,
    updateData: EventEntity): Promise<EventEntity> {
    // Check if coordinator exists
    const coordinator = await this.eventCoordinatorRepository.findOne({ where: { id: coordinatorId } });
    if (!coordinator) {
      throw new NotFoundException(`Event-Coordinator with ID ${coordinatorId} not found`);
    }
  
    // Check if the event exists
    const event = await this.eventRepo.findOne({
      where: { eid: eventId, eventCoordinator: { id: coordinatorId } },
      relations: ['eventCoordinator'], // Include the profile in the query
      select: {
          eid: true,
          name: true,
          description: true,
          date: true,
          location: true,
        eventCoordinator: {
          id: true,
        name: true,
        },
      },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  
    // Update event coordinator fields
    Object.assign(event, updateData);
  
    // // Update profile if data is provided
    // if (event.eventCoordinator) {
    //   Object.assign(event.eventCoordinator, updateData);
      
    //   // Save updated profile
    //   await this.eventRepo.save(event.eventCoordinator);
    // }
  
    // Save updated event coordinator entity
    return this.eventRepo.save(event);
  }
  


  async deleteEvent(id: number): Promise<void> {
      await this.eventRepo.delete(id);
  }

}
