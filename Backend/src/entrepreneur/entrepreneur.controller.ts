import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { EntrepreneurService } from "./entrepreneur.service";
import { AuthDTO } from "src/auth/dto/auth.dto";
import * as bcrypt from 'bcrypt'
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { EntrepreneurGuard } from "src/auth/guards/entrepreneur.guard";
import { EntrepreneurProfileDTO } from "./entrepreneur.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { IdeaDTO } from "src/idea/idea.dto";
import { IdeaEntity } from "src/idea/idea.entity";
import { PrototypeDTO } from "src/prototype/prototype.dto";
import { PresentationModule } from "src/presentation/presentation.module";
import { PresentationDTO, SeekingDTO } from "src/presentation/presentation.dto";
import { SeekingEntity } from "src/presentation/seeking.entity";

@Controller('entrepreneur')
export class EntrepreneurController {
    constructor(private readonly entrepreneurService: EntrepreneurService) {}

    // @Post('create-entreprenuer')
    // @UsePipes(new ValidationPipe)
    // async createEntrepreneur(@Body() myobj: AuthDTO): Promise<AuthDTO> {
      
    //   const salt = await bcrypt.genSalt();
    //   const hashedpassword = await bcrypt.hash(myobj.password, salt); 
    //   myobj.password= hashedpassword;  
    //   return this.entrepreneurService.createEntrepreneur(myobj);
    // }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Put('update-profile')
    @UsePipes(new ValidationPipe())
    async updateProfile(@Req() req, @Body() ProfileDto: EntrepreneurProfileDTO): Promise<any>{
        const user = req.user; 
        //const admin: AdminEntity = req.user;
        return this.entrepreneurService.updateEntrepreneur(user.id, ProfileDto);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Put('update-profile-image')
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
    async updateProfileImage(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        const user = req.user; // Extract user from request, coming from JWT token
        const ProfileDto = new EntrepreneurProfileDTO();
        ProfileDto.entrepreneur_file = file.filename;

        return this.entrepreneurService.updateProfileImage(user.id, ProfileDto);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('/getimage/:id')
    async getImage(@Param('id') id: number, @Res() res): Promise<any> {
        const filename = await this.entrepreneurService.getProfileImage(id); // Fetch filename
        if (!filename) {
            throw new NotFoundException('Image not found');
        }
        return res.sendFile(filename, { root: './uploads' });
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('all')
    getAll(): object {
        return this.entrepreneurService.getAllEntrepreneur();
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('/:id')
    getEntrepreneurById(@Param('id') id: number): object {
        return this.entrepreneurService.getEntrepreneurById(id);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('/:email')
    getEntrepreneurByEmail(@Param('email') email: string): object {
        return this.entrepreneurService.getEntrepreneurByEmail(email);
    }

    //Idea

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Post('addidea/:id') //JSON {title, description, eid}
    async addIdea(@Param('id') id: number, @Body() myobj: IdeaEntity): Promise<IdeaEntity> {
        return this.entrepreneurService.addIdea(id, myobj);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('idea/:id')
    async getIdeaById(@Param('id') id: number): Promise<IdeaDTO> {
        return this.entrepreneurService.getIdeaById(id);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('all-ideas')
    async getAllIdeas(): Promise<IdeaDTO[]> {
        return this.entrepreneurService.getAllIdeas();
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Put('idea/:id')
    async updateIdea(@Param('id') id: number, @Body() updateData: IdeaDTO): Promise<IdeaDTO> {
        return this.entrepreneurService.updateIdea(id, updateData);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Delete('idea/:id')
    async deleteIdea(@Param('id') id: number): Promise<void> {
        return this.entrepreneurService.deleteIdea(id);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('idea/prototype/:ideaId')
    async getPBrototypeyId(@Param('ideaId') ideaId: number): Promise<PrototypeDTO> {
        return this.entrepreneurService.getPrototypeById(ideaId);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Put('idea/prototype/update-prototype/:ideaId')
    async updatePrototype(@Param('ideaId') ideaId: number, @Body() updateData: PrototypeDTO): Promise<PrototypeDTO> {
        return this.entrepreneurService.updatePrototype(ideaId, updateData);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Delete('idea/prototype/delete-prototype/:ideaId')
    async deletePrototype(@Param('ideaId') ideaId: number): Promise<void> {
        return this.entrepreneurService.deletePrototype(ideaId);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('idea/presentation/:ideaId')
    async getPresentationById(@Param('ideaId') ideaId: number): Promise<PresentationDTO> {
        return this.entrepreneurService.getPresentationById(ideaId);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Put('idea/presentation/update-presentation/:ideaId')
    async updatePresentation(@Param('ideaId') ideaId: number, @Body() updateData: PresentationDTO): Promise<PresentationDTO> {
        return this.entrepreneurService.updatePresentation(ideaId, updateData);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Delete('idea/presentation/delete-presentation/:ideaId')
    async deletePresentation(@Param('ideaId') ideaId: number): Promise<void> {
        return this.entrepreneurService.deletePresentation(ideaId);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('idea/presentation/:seekingId')
    async getSeekingById(@Param('seekingId') seekingId: number): Promise<SeekingDTO> {
        return this.entrepreneurService.getSeekingById(seekingId);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Get('idea/presentation/all-seekings')
    async getAllSeekings(): Promise<SeekingDTO[]> {
        return this.entrepreneurService.getAllSeekings();
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Put('idea/presentation/update-seeking/:seekingId')
    async updateSeeking(@Param('seekingId') seekingId: number, @Body() updateData: SeekingDTO): Promise<SeekingDTO> {
        return this.entrepreneurService.updateSeeking(seekingId, updateData);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Delete('idea/presentation/delete-seeking/:seekingId')
    async deleteSeeking(@Param('seekingId') seekingId: number): Promise<void> {
        return this.entrepreneurService.deleteSeeking(seekingId);
    }

    @UseGuards(JwtAuthGuard, EntrepreneurGuard)
    @Post('presentation/:presentationId/new-seeking')
    async newSeeking(
        @Param('presentationId') presentationId: number,
        @Body() seekingData: SeekingEntity,
    ): Promise<SeekingEntity> {
        return this.entrepreneurService.newSeeking(presentationId, seekingData);
    }

}