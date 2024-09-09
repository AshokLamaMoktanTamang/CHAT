import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QUEUES } from '@/utils/constants';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.mail.name,
      defaultJobOptions: { removeOnComplete: true },
    }),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
