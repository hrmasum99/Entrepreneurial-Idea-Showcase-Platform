import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UsePipes, ValidationPipe, Req, UseInterceptors, UploadedFile, BadRequestException, NotFoundException, Res } from '@nestjs/common';
import { EventCoordinatorService } from './event-coordinator.service';
import { Event_CoordinatorEntity } from './event-coordinator.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Event_CoordinatorGuard } from 'src/auth/guards/event-coordinator.guard';
import { changePasswordDTO } from 'src/auth/dto/chnage-password.dto';
import { EventEntity } from '../event/event.entity';
import { EventCoordinatorProfileDTO, UpdateEventCoordinatorDTO } from './event-coordinator.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { EventDTO } from '../event/event.dto';

@Controller('event-coordinator')
export class EventCoordinatorController {
  constructor(private readonly eventCoordinatorService: EventCoordinatorService) {}

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Get('/getall')
    async findAll(): Promise<Event_CoordinatorEntity[]> {
        return this.eventCoordinatorService.findAll();
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Get('get/:id')
    async findOne(@Param('id') id: number): Promise<Event_CoordinatorEntity> {
        return this.eventCoordinatorService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Put('/update-profile')
    @UsePipes(new ValidationPipe())
    async updateProfile(@Req() req, @Body() ProfileDto: UpdateEventCoordinatorDTO): Promise<any>{
        const user = req.user; 
        //const admin: AdminEntity = req.user;
        return this.eventCoordinatorService.updateCoordinator(user.id, ProfileDto);
    }

    // @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    // @Put(':id/change-password')
    // @UsePipes(new ValidationPipe())
    // async changePassword(
    // @Param('id') coordinatorId: number,
    // @Body() changePasswordDto: changePasswordDTO,
    // ): Promise<any> {
    // //const { oldpassword, newpassword } = changePasswordDto;
    // return this.eventCoordinatorService.changeEventCoordinatorPassword(coordinatorId, changePasswordDto);
    // }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Put('/update-profile-image')
    @UseInterceptors(FileInterceptor('myfile',
        { fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/))
            cb(null, true);
            else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
            },
            limits: { fileSize: 3000000 },
            storage:diskStorage({
            destination: './uploads',
            filename: function (req, file, cb) {
            cb(null,Date.now()+file.originalname)
            },
            })
        })
    )
    async updateProfileImage(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        const user = req.user; // Extract user from request, coming from JWT token
        const ProfileDto = new EventCoordinatorProfileDTO();
        ProfileDto.event_coordinator_file = file.filename;

        return this.eventCoordinatorService.updateProfileImage(user.id, ProfileDto);
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Get('/getimage/:id')
    async getImage(@Param('id') id: number, @Res() res): Promise<any> {
        const filename = await this.eventCoordinatorService.getAdminProfileImage(id); // Fetch filename
        if (!filename) {
            throw new NotFoundException('Image not found');
        }
        return res.sendFile(filename, { root: './uploads' });
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Delete('/delete-coordinator/:id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.eventCoordinatorService.remove(id);
    }

    // Event

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Post('/addevent/:id')
    async addEvent(@Param('id') id: number, @Body() myobj: EventEntity,): Promise<EventEntity> {

        return this.eventCoordinatorService.addEvent(id, myobj);
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Get('/all-events')
    async getAllEvents(): Promise<EventDTO[]> {
        return this.eventCoordinatorService.getAllEvents();
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Get('/geteventswithcoordinators')
    getAllEventswithEventCoordinators(): Promise<Event_CoordinatorEntity[]> {
        return this.eventCoordinatorService.getAllEventsWithCoordinators();
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Get('/event/:id')
    async getEventById(@Param('id') id: number): Promise<EventEntity> {
        return this.eventCoordinatorService.getEventById(id);
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Put('/:coordinatorId/update-event/:eventId')
    async updateEvent(
    @Param('coordinatorId') coordinatorId: number,
    @Param('eventId') eventId: number,
    @Body() updateData: EventEntity
    ): Promise<EventEntity> {
        // console.log(`Coordinator ID: ${coordinatorId}, Event ID: ${eventId}`); 

    if (!eventId || !coordinatorId) {
        throw new BadRequestException('Invalid event ID');
    }
    return this.eventCoordinatorService.updateEvent(coordinatorId, eventId, updateData);
    }

    @UseGuards(JwtAuthGuard, Event_CoordinatorGuard)
    @Delete('/delete-event/:id')
    async deleteEvent(@Param('id') id: number): Promise<void> {
        return this.eventCoordinatorService.deleteEvent(id);
    }

}
