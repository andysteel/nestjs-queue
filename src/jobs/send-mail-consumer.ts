import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from 'src/user/create-user-dto';

@Processor('send-mail-queue')
export class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('send-mail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;
    await this.mailService.sendMail({
      to: data.email,
      from: 'Dev - Anderson Dias <naoresponda@andersondias.com.br>',
      subject: 'Seja bem vinda ao Mundo de Anderson.',
      text: `Olá ${data.name} seu cadastro foi realizado com sucesso.`,
    });
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(`Send Mail to ${job.data.name} completed.`);
  }
}
