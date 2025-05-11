/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe, Req, Delete, BadRequestException, NotFoundException, UseInterceptors, UploadedFile, Res } from "@nestjs/common";
import { AdminService } from "./admin.service";
import * as bcrypt from 'bcrypt';
//import { AdminProfile } from "./admin.profile";
import { AdminEntity } from "./admin.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { AdminDTO, AdminProfileDTO, AdminUpdateDateDTO, AdminUpdateDTO } from "./admin.dto";
import { AuthDTO } from "src/auth/dto/auth.dto";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";
import { UpdateEventCoordinatorDTO } from "src/event-coordinator/event-coordinator.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
//import path from "path";
import { JudgeDTO, JudgeProfileDTO, JudgeUpdateDTO } from "src/judge/judge.dto";
import { EntrepreneurDTO, EntrepreneurProfileDTO } from "src/entrepreneur/entrepreneur.dto";

@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('alladmin')
    getAll(): object {
        return this.adminService.getAllAdmin();
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('getadmin/:id')
    getAdminById(@Param('id') id: number): object {
        return this.adminService.getAdminById(id);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('getadminbyemail/:email')
    getAdminByEmail(@Param('email') email: string): object {
        return this.adminService.getAdminByEmail(email);
    }

    // @Get()
    // async getAdminByQuery(
    // @Query('id') id?: number,
    // @Query('email') email?: string
    // ): Promise<AdminEntity[]> {
    // const admins = await this.adminService.findByIdAndEmail(id, email);
    // if (!admins || admins.length === 0) {
    //     throw new NotFoundException('No admin found with provided criteria');
    // }
    // return admins;
    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('createadmin')
    @UsePipes(new ValidationPipe)
    async addAdmin(@Body() myobj: AdminDTO): Promise<AuthDTO> {
      
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(myobj.password, salt); 
      myobj.password= hashedpassword;  
      return this.adminService.addAdmin(myobj);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('all-with-profile')
    async getAllAdminWithProfile(): Promise<AdminEntity[]> {
        return this.adminService.getAllAdminWithProfile();
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('admindata')
    async getAdminData(@Req() req): Promise<AdminDTO> {
        const user = req.user; // Extract admin ID from JWT payload
        return this.adminService.getAdminData(user.id);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('getprofile/:id')
    async getAdminProfile(@Param('id') id: number): Promise<AdminDTO>  {
        return this.adminService.getAdminWithProfileByAdminId(id);
    }
    
    // @UseGuards(JwtAuthGuard, AdminGuard)
    // @Get('getadmin/:id')
    // getAdminById(@Param('id') id: number): object {
    //     return this.adminService.getAdminById(id);
    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('profile')
    async getAdminWithProfile(@Req() req): Promise<AdminEntity> {
        const user = req.user; // Extract admin ID from JWT payload
        return this.adminService.getAdminWithProfileByAdminId(user.id);
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    // @Get('profile/:id')
    // async getAdminWithProfileByAdminId(@Param('id') id: number): Promise<AdminEntity> {
    //     return this.adminService.getAdminWithProfileByAdminId(id);
    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('update-profile')   //date formate: 2024-10-25
    @UsePipes(new ValidationPipe())
    async updateProfile(@Req() req, @Body() adminProfileDto: AdminUpdateDTO): Promise<any>{
        const user = req.user; 
        //const admin: AdminEntity = req.user;
        return this.adminService.updateAdmin(user.id, adminProfileDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('update-profile-dob')   //date formate: 2024-10-25
    @UsePipes(new ValidationPipe())
    async updateDOB(@Req() req, @Body() adminDateDto: AdminUpdateDateDTO): Promise<any>{
        const user = req.user; 
        //const admin: AdminEntity = req.user;
        return this.adminService.updateDOB(user.id, adminDateDto);
    }

    // @Post('addimage')
    // @UseInterceptors(FileInterceptor('myfile',
    // { fileFilter: (req, file, cb) => {
    //     if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
    //     cb(null, true);
    //     else {
    //     cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    //     }
    //     },
    //     limits: { fileSize: 30000 },
    //     storage:diskStorage({
    //     destination: './uploads',
    //     filename: function (req, file, cb) {
    //     cb(null,Date.now()+file.originalname)
    //     },
    //     })
    //     }
    // )
    // )
    // addImage(@Body() myobj:AdminProfileDTO,@UploadedFile() file: Express.Multer.File) {

    // myobj.admin_filename = file.filename;
    // return this.adminService.updateAdminProfileImage(myobj);

    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('update-profile-image')
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
        const adminProfileDto = new AdminProfileDTO();
        adminProfileDto.admin_filename = file.filename;

        return this.adminService.updateAdminProfileImage(user.id, adminProfileDto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('get-profile-image/:id')
    async getImage(@Param('id') id: number): Promise<any> {
        return this.adminService.getAdminProfileImage(id); // Fetch filename
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('/get-image/:name')
    getProfileImage(@Param('name') filename:string, @Res() res) {

    res.sendFile(filename,{ root: './uploads' })
    }
    // @Get('/get-image/:name')
    // getProfileImage(@Param('name') filename: string, @Res() res) {
    // const filePath = path.join('./uploads', filename);
    // res.setHeader('Content-Type', 'image/jpeg'); // Set Content-Type for images
    // res.sendFile(filePath, { root: '.' });
    // }



    //Event-Coordinator

    // @Post('addeventcoordinator/:id')
    // async addCoordinator(@Param('id') id: number, @Body() myobj: Event_CoordinatorEntity,): Promise<Event_CoordinatorEntity> {

    //     return this.adminService.addCoordinator(id, myobj);
    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('addeventcoordinator/:id')    //bug: still create profile if failed create coordinator
    async addCoordinator(@Param('id') id: number, @Body() myobj: Event_CoordinatorEntity): Promise<Event_CoordinatorEntity> {
        const salt = await bcrypt.genSalt(); 
        const hashedPassword = await bcrypt.hash(myobj.password, salt); 
        myobj.password = hashedPassword; // Set the hashed password
        return this.adminService.addCoordinator(id, myobj);
    }

    // @Post('addcoordinator/:id')
    // @UseInterceptors(FileInterceptor('myfile',
    // {storage:diskStorage({
    //     destination: './uploads',
    //     filename: function (req, file, cb) {
    //     cb(null,Date.now()+file.originalname)
    //     }
    // })
    // }))
    // addCoordinator(@Param('id') id: number, @Body() myobj: Event_CoordinatorEntity,@UploadedFile(  new ParseFilePipe({
    //     validators: [
    //     new MaxFileSizeValidator({ maxSize: 160000 }),
    //     new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
    //     ],
    // }),) file: Express.Multer.File){
    
    // mydto.filename = file.filename;  
    // console.log(mydto)
    // return this.adminService.insertUser(mydto);
    // }

    
    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('getadminwithcoordinator')
    getAllAdminswithEventCoordinators(): Promise<AdminEntity[]> {
        return this.adminService.getAllAdminsWithCoordinators();
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('eventcoordinator/:id')
    async getCoordinatorById(@Param('id') id: number): Promise<Event_CoordinatorEntity> {
        return this.adminService.getCoordinatorById(id);
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('/event-coordinator/image/:name')
    getEvnCoProfileImage(@Param('name') filename:string, @Res() res) {

    res.sendFile(filename,{ root: './uploads' })
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    // @Get('/:adminId/coordinator/:coordinatorId')
    // async getCoordinatorProfile(
    // @Param('adminId') adminId: number,
    // @Param('coordinatorId') coordinatorId: number,
    // ): Promise<Event_CoordinatorEntity> {
    // return this.adminService.getCoordinatorProfile(adminId, coordinatorId);
    // }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    // @Get('/:adminId/coordinator/:coordinatorId')
    // async getCoordinatorProfile(
    // @Query('adminId') adminId?: number,
    // @Query('coordinatorId') coordinatorId?: number,
    // ): Promise<Event_CoordinatorEntity[]> {
    // return this.adminService.getCoordinatorProfile(adminId, coordinatorId);
    // }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    // @Get('/:adminId/coordinator/:coordinatorId')
    // async getCoordinatorProfile(
    // @Param('adminId') adminId: number,
    // @Param('coordinatorId') coordinatorId: number,
    // ): Promise<Event_CoordinatorEntity[]> {
    // console.log(`Admin ID: ${adminId}, Coordinator ID: ${coordinatorId}`);
    // return this.adminService.getCoordinatorProfile(adminId, coordinatorId);
    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('/coordinator/:coordinatorId')
    async getCoordinatorProfile(
    @Param('coordinatorId') coordinatorId: number,
    ): Promise<Event_CoordinatorEntity[]> {
    // console.log(`Coordinator ID: ${coordinatorId}`);
    return this.adminService.getCoordinatorProfile(coordinatorId);
    }


    // @Put('/:adminId/update-coordinator/:coordinatorId')
    // async updateEventCoordinator(
    // @Param('adminId') adminId: number,
    // @Param('coordinatorId') coordinatorId: number,
    // @Body() updateData: UpdateEventCoordinatorDTO
    // ): Promise<Event_CoordinatorEntity> {
    //     console.log(`Admin ID: ${adminId}, Coordinator ID: ${coordinatorId}`); 

    // if (!adminId || !coordinatorId) {
    //     throw new BadRequestException('Invalid admin or coordinator ID');
    // }
    // return this.adminService.updateEventCoordinator(adminId, coordinatorId, updateData);
    // }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('update-coordinator/:coordinatorId')
    @UsePipes(new ValidationPipe())
    async updateEventCoordinator(
    @Param('coordinatorId') coordinatorId: number,
    @Body() updateData: UpdateEventCoordinatorDTO
    ): Promise<Event_CoordinatorEntity> {
        console.log(`Coordinator ID: ${coordinatorId}`); 

    if (!coordinatorId) {
        throw new BadRequestException('Invalid coordinator ID');
    }
    return this.adminService.updateEventCoordinator(coordinatorId, updateData);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('update-coordinator/upload-profile-image/:coordinatorId')
    @UseInterceptors(FileInterceptor('myfile', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
                cb(null, true);
            } else {
                console.error('Invalid file type:', file.originalname);
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 3000000 },
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = Date.now() + '-' + file.originalname;
                cb(null, filename);
            },
        }),
    }))
    async updateEventCoordinatorProfileImage(
        @Param('coordinatorId') coordinatorId: number,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            if (!coordinatorId) {
                throw new BadRequestException('Coordinator ID is required');
            }

            if (!file) {
                throw new BadRequestException('No file uploaded or invalid file type');
            }

            const eventCoordinatorProfileDto = { event_coordinator_file: file.filename };
            return this.adminService.updateEventCoordinatorProfileImage(coordinatorId, eventCoordinatorProfileDto);
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('delete-eventcoordinator/:id')
    async deleteCoordinator(@Param('id') id: number): Promise<void> {
        return this.adminService.deleteCoordinator(id);
    }


    //Judge

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('create-judge')
    @UsePipes(new ValidationPipe)
    async createJudge(@Body() myobj: AuthDTO): Promise<AuthDTO> {
      
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(myobj.password, salt); 
      myobj.password= hashedpassword;  
      return this.adminService.createJudge(myobj);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('all-judge')
    getAllJudge(): object {
        return this.adminService.getAllJudge();
    }
    
    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('judge/:id')
    getJudgeById(@Param('id') id: number): object {
        return this.adminService.getJudgeById(id);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('judge/profile/:id')
    async getJudgeProfile(
    @Param('id') judgeId: number,
    ): Promise<JudgeDTO[]> {
    return this.adminService.getJudgeProfile(judgeId);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('judge/update-profile/:id')
    @UsePipes(new ValidationPipe())
    async updateJudgeProfile(@Param('id') judgeId: number, @Body() ProfileDto: JudgeUpdateDTO): Promise<JudgeProfileDTO>{
        if (!judgeId) {
            throw new BadRequestException('Invalid Judge ID');
        }
        return this.adminService.updateJudge(judgeId, ProfileDto);
    }
    
    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('judge/update-profile-image/:id')
    @UseInterceptors(FileInterceptor('myfile',
        { fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/))
            cb(null, true);
            else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
            },
            limits: { fileSize: 30000 },
            storage:diskStorage({
            destination: './uploads',
            filename: function (req, file, cb) {
            cb(null,Date.now()+file.originalname)
            },
            })
        })
    )
    async updateJudgeProfileImage(
        @Param('id') judgeId: number,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        const judgeProfileDto = new JudgeProfileDTO();
        judgeProfileDto.judge_file = file.filename;

        return this.adminService.updateJudgeProfileImage(judgeId, judgeProfileDto);
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('judge/get-image/:id')
    async getJudgeImage(@Param('id') id: number, @Res() res): Promise<any> {
        const filename = await this.adminService.getJudgeProfileImage(id); // Fetch filename
        if (!filename) {
            throw new NotFoundException('Image not found');
        }
        return res.sendFile(filename, { root: './uploads' });
    }


    //Entrepreneur

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('create-entrepreneur')
    @UsePipes(new ValidationPipe)
    async createEntrepreneur(@Body() myobj: AuthDTO): Promise<AuthDTO> {
      
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(myobj.password, salt); 
      myobj.password= hashedpassword;  
      return this.adminService.createEntrepreneur(myobj);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('all-entrepreneur')
    getAllEntrepreneur(): object {
        return this.adminService.getAllEntrepreneur();
    }
    
    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('entrepreneur/:id')
    getEntrepreneurById(@Param('id') id: number): object {
        return this.adminService.getEntrepreneurById(id);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('entrepreneur/profile/:id')
    async getEntrepreneurProfile(
    @Param('id') entrepreneurId: number,
    ): Promise<EntrepreneurDTO[]> {
    return this.adminService.getEntrepreneurProfile(entrepreneurId);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('entrepreneur/update-profile/:id')
    @UsePipes(new ValidationPipe())
    async updateEntrepreneurProfile(@Param('id') entrepreneurId: number, @Body() ProfileDto: EntrepreneurProfileDTO): Promise<EntrepreneurProfileDTO>{
        if (!entrepreneurId) {
            throw new BadRequestException('Invalid Entrepreneur ID');
        }
        return this.adminService.updateEntrepreneur(entrepreneurId, ProfileDto);
    }
    
    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('entrepreneur/update-profile-image/:id')
    @UseInterceptors(FileInterceptor('myfile',
        { fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/))
            cb(null, true);
            else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
            },
            limits: { fileSize: 30000 },
            storage:diskStorage({
            destination: './uploads',
            filename: function (req, file, cb) {
            cb(null,Date.now()+file.originalname)
            },
            })
        })
    )
    async updateEntrepreneurProfileImage(
        @Param('id') entrepreneurId: number,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        const entrepreneurProfileDto = new EntrepreneurProfileDTO();
        entrepreneurProfileDto.entrepreneur_file = file.filename;

        return this.adminService.updateEntrepreneurProfileImage(entrepreneurId, entrepreneurProfileDto);
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('entrepreneur/get-image/:id')
    async getEntrepreneurImage(@Param('id') id: number, @Res() res): Promise<any> {
        const filename = await this.adminService.getEntrepreneurProfileImage(id); // Fetch filename
        if (!filename) {
            throw new NotFoundException('Image not found');
        }
        return res.sendFile(filename, { root: './uploads' });
    }
    
}