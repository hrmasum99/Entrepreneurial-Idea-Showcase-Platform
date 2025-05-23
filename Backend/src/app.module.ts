import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JudgeModule } from './judge/judge.module';
import { EntrepreneurModule } from './entrepreneur/entrepreneur.module';
import { EventCoordinatorModule } from './event-coordinator/event-coordinator.module';
import { IdeaModule } from './idea/idea.module';
import { PrototypeModule } from './prototype/prototype.module';
import { PresentationModule } from './presentation/presentation.module';
import { InvestmentModule } from './investment/investment.module';
// import { EventModule } from './event/event.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}),
    AuthModule, 
    AdminModule, 
    JudgeModule, 
    EntrepreneurModule, 
    EventCoordinatorModule,
    // EventModule, 
    IdeaModule, 
    PrototypeModule, 
    PresentationModule, 
    InvestmentModule,
    ReviewModule,
    TypeOrmModule.forRoot(
    { type: 'postgres',
    host: process.env.dbhost,
    port: +process.env.dbport,
    username: process.env.dbuser,
    password: process.env.dbpass,
    database: 'cs',//Change to your database name
    autoLoadEntities: true,
    synchronize: true, 
    } ),MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: +process.env.mailport,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.mailuser,
          pass: process.env.mailpass,
        },
      },
    }), ],
  controllers: [AppController],
  providers: [AppService],
  //exports: [AppService]
})
export class AppModule {}
