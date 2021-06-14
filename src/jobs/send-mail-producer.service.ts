import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserDTO } from 'src/user/create-user-dto';

@Injectable()
export class SendMailProducerService {
  constructor(@InjectQueue('send-mail-queue') private queue: Queue) {}

  async sendMail(createUserDTO: CreateUserDTO) {
    await this.queue.add('send-mail-job', createUserDTO, { delay: 5000 });
  }
}
