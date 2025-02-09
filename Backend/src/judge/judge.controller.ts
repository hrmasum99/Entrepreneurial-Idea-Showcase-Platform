import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JudgeService } from "./judge.service";
import { JudgeGuard } from "src/auth/guards/judge.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { JudgeProfileDTO, JudgeUpdateDTO } from "./judge.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { AuthDTO } from "src/auth/dto/auth.dto";
import * as bcrypt from 'bcrypt';  
import { ReviewEntity } from "src/review/review.entity";
import { OfferEntity } from "src/review/offer.entity";

@Controller('judge')
export class JudgeController {
    constructor(private readonly judgeService: JudgeService) {}

    // @Post('create-judge')
    // @UsePipes(new ValidationPipe)
    // async createJudge(@Body() myobj: AuthDTO): Promise<AuthDTO> {
      
    //   const salt = await bcrypt.genSalt();
    //   const hashedpassword = await bcrypt.hash(myobj.password, salt); 
    //   myobj.password= hashedpassword;  
    //   return this.judgeService.createJudge(myobj);
    // }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Put('update-profile')
    @UsePipes(new ValidationPipe())
    async updateProfile(@Req() req, @Body() ProfileDto: JudgeUpdateDTO): Promise<any>{
        const user = req.user; 
        //const admin: AdminEntity = req.user;
        return this.judgeService.updateJudge(user.id, ProfileDto);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
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
        const judgeProfileDto = new JudgeProfileDTO();
        judgeProfileDto.judge_file = file.filename;

        return this.judgeService.updateProfileImage(user.id, judgeProfileDto);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Get('/getimage/:id')
    async getImage(@Param('id') id: number, @Res() res): Promise<any> {
        const filename = await this.judgeService.getProfileImage(id); // Fetch filename
        if (!filename) {
            throw new NotFoundException('Image not found');
        }
        return res.sendFile(filename, { root: './uploads' });
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Get('all-judge')
    getAll(): object {
        return this.judgeService.getAllJudge();
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Get('/:id')
    getJudgeById(@Param('id') id: number): object {
        return this.judgeService.getJudgeById(id);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Get('/:email')
    getJudgeByEmail(@Param('email') email: string): object {
        return this.judgeService.getJudgeByEmail(email);
    }

    //Review

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Post(':judgeId/presentation/:presentationId/add-review')
    async addReview(
        @Param('judgeId') judgeId: number,
        @Param('presentationId') presentationId: number,
        @Body() reviewData: ReviewEntity,
    ): Promise<ReviewEntity> {
        return this.judgeService.addReview(judgeId, presentationId, reviewData);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Get('reviews')
    async getAllReviews(): Promise<ReviewEntity[]> {
        return this.judgeService.getAllReviews();
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Get('review/:id')
    async getReviewById(@Param('id') id: number): Promise<ReviewEntity> {
        return this.judgeService.getReviewById(id);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Patch('update-review/:id')
    async updateReview(
        @Param('id') id: number,
        @Body() reviewData: Partial<ReviewEntity>,
    ): Promise<ReviewEntity> {
        return this.judgeService.updateReview(id, reviewData);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Delete('review/:id')
    async deleteReview(@Param('id') id: number): Promise<void> {
        return this.judgeService.deleteReview(id);
    }

    @UseGuards(JwtAuthGuard, JudgeGuard)
    @Post('review/:reviewId/new-offer')
    async newOffer(
        @Param('reviewId') reviewId: number,
        @Body() offerData: OfferEntity,
    ): Promise<OfferEntity> {
        return this.judgeService.newOffer(reviewId, offerData);
    }

}