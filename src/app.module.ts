import { BullModule, InjectQueue } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { SendMailProducerService } from './jobs/send-mail-producer.service';
import { SendMailConsumer } from './jobs/send-mail-consumer';
import { Queue } from 'bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        port: Number(process.env.SMTP_PORT),
        //ignoreTLS: true,
        //secure: false,
        auth: {
          user: process.env.SMTP_LOGIN,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, SendMailProducerService, SendMailConsumer],
})
export class AppModule {
  constructor(@InjectQueue('send-mail-queue') private sendMailQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendMailQueue)]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
