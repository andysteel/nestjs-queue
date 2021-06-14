import { Body, Controller, Post } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/send-mail-producer.service';
import { CreateUserDTO } from './create-user-dto';

@Controller('user')
export class UserController {
  constructor(private sendMailService: SendMailProducerService) {}

  @Post()
  async createUser(@Body() createUser: CreateUserDTO) {
    this.sendMailService.sendMail(createUser);
  }
}
