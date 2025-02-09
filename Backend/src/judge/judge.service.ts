import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JudgeEntity } from "./judge.entity";
import { Repository } from "typeorm";
import { JudgeProfile } from "./judge.profile";
import { AuthDTO } from "src/auth/dto/auth.dto";
import * as bcrypt from 'bcrypt'; 
import { changePasswordDTO } from "src/auth/dto/chnage-password.dto";
import { JudgeProfileDTO, JudgeUpdateDTO } from "./judge.dto";
import { ReviewEntity } from "src/review/review.entity";
import { OfferEntity } from "src/review/offer.entity";
import { PresentationEntity } from "src/presentation/presentation.entity";

@Injectable()
export class JudgeService {
  constructor(
    @InjectRepository(JudgeEntity)
    private readonly judgeRepo: Repository<JudgeEntity>, @InjectRepository(JudgeProfile) 
    private readonly judgeProfileRepo: Repository<JudgeProfile>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(OfferEntity)
    private readonly offerRepo: Repository<OfferEntity>,
    @InjectRepository(PresentationEntity)
    private readonly presentationRepo: Repository<PresentationEntity>,
  ) { }

    // findByEmail(email: string) {
    //   throw new Error('Method not implemented.');
    // }

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

    async  getJudgeByEmail(email:string): Promise<JudgeEntity> {
        return await this.judgeRepo.findOne({
            where: {
                email: email,
            }
        });
    }

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

    async findByCredentials(loginDto: AuthDTO): Promise<any> {
        return this.judgeRepo.findOne({ where: { email:loginDto.email } });
    }

    async changeJudgePassword(id: number, changePasswordDto: changePasswordDTO): Promise<string> {
    const user = await this.judgeRepo.findOne({ where: { id } });

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

    await this.judgeRepo.save(user);
    return 'Password changed successfully';
    }

    async updateJudge(id: number, judgeProfileDto: JudgeUpdateDTO): Promise<any> {
        const user = await this.judgeRepo.findOne({
          where: { id },
          relations: ['judgeProfile'],
        });
    
        if (!user) {
          throw new NotFoundException('Judge not found');
        }
    
          user.judgeProfile.judge_name = judgeProfileDto.judge_name;
          user.judgeProfile.judge_NID = judgeProfileDto.judge_NID;
          user.judgeProfile.judge_phone = judgeProfileDto.judge_phone;
          user.judgeProfile.judge_gender = judgeProfileDto.judge_gender;
          user.judgeProfile.judge_address = judgeProfileDto.judge_address;
          user.judgeProfile.judge_DOB = judgeProfileDto.judge_DOB;
    
          await this.judgeProfileRepo.save(user.judgeProfile);
        return user;
    }
  
    async updateProfileImage(id: number, judgeProfileDto: JudgeProfileDTO): Promise<any> {
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

    async getProfileImage(id: number): Promise<string> {
      const judge = await this.judgeRepo.findOne({
          where: { id },
          relations: ['judgeProfile'],
      });
  
      if (!judge || !judge.judgeProfile) {
          throw new NotFoundException('Judge or profile not found');
      }
  
      return judge.judgeProfile.judge_filename;
    } 

    async deleteJudge(id: number): Promise<void> {
      const judge = await this.judgeRepo.findOne({ where: { id }, relations: ['judgeProfile'] });
      
      if (!judge) {
        throw new NotFoundException(`Judge with ID ${id} not found`);
      }
    
      await this.judgeRepo.remove(judge); // This will also delete the associated profile due to cascade
    }
  

    //Review

    async addReview(judgeId: number, presentationId: number, reviewData: ReviewEntity): Promise<ReviewEntity> {
      // Find Judge by ID
      const judge = await this.judgeRepo.findOne({ where: { id: judgeId } });
      if (!judge) {
          throw new NotFoundException('Judge not found');
      }

      // Find Presentation by ID
      const presentation = await this.presentationRepo.findOne({ where: { pid: presentationId } });
      if (!presentation) {
          throw new NotFoundException('Presentation not found');
      }

      // Assign judge and presentation to the review
      reviewData.judge = judge;
      reviewData.presentation = presentation;

      // If offers are provided, associate them with the review
      if (reviewData.offers && reviewData.offers.length > 0) {
          const offerEntities: OfferEntity[] = [];
          for (const offerData of reviewData.offers) {
              const offer = new OfferEntity();
              offer.rid = reviewData.rid;  // Using review id to associate
              offer.offer = offerData.offer;
              offer.review = reviewData;

              offerEntities.push(offer);
          }
          reviewData.offers = await this.offerRepo.save(offerEntities);
      }

      // Save the review entity with associations
      return this.reviewRepo.save(reviewData);
    }

    async getAllReviews(): Promise<ReviewEntity[]> {
      return this.reviewRepo.find({ relations: ['judge', 'presentation', 'offers'] });
    }

    async getReviewById(id: number): Promise<ReviewEntity> {
      const review = await this.reviewRepo.findOne({ where: { rid: id }, relations: ['judge', 'presentation', 'offers'] });
      if (!review) {
          throw new NotFoundException('Review not found');
      }
      return review;
    }
        
    async updateReview(id: number, reviewData: Partial<ReviewEntity>): Promise<ReviewEntity> {
      const review = await this.getReviewById(id);
      if (!review) {
          throw new NotFoundException('Review not found');
      }
  
      // Update fields
      review.interest = reviewData.interest || review.interest;
      review.date = reviewData.date || review.date;
  
      // Update offers if provided
      if (reviewData.offers && reviewData.offers.length > 0) {
          await this.offerRepo.delete({ review: { rid: review.rid } }); // Remove old offers
  
          const offerEntities: OfferEntity[] = reviewData.offers.map(offerData => {
              const offer = new OfferEntity();
              offer.rid = review.rid;
              offer.offer = offerData.offer;
              offer.review = review;
              return offer;
          });
  
          review.offers = await this.offerRepo.save(offerEntities);
      }
  
      return this.reviewRepo.save(review);
    }

    async deleteReview(id: number): Promise<void> {
      const review = await this.getReviewById(id);
      if (!review) {
          throw new NotFoundException('Review not found');
      }
  
      await this.reviewRepo.remove(review);
    }

    async newOffer(reviewId: number, offerData: OfferEntity): Promise<OfferEntity> {
      // Find the review by ID
      const review = await this.reviewRepo.findOne({ where: { rid: reviewId } });
      if (!review) {
          throw new NotFoundException('Review not found');
      }

      // Create and associate the new offer
      const offer = new OfferEntity();
      offer.rid = reviewId; // Set the review ID as part of the composite key
      offer.offer = offerData.offer;
      offer.review = review;

      return this.offerRepo.save(offer);
    }
}