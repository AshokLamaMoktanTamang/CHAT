import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { QUEUES } from '@/utils/constants';
import { MailService } from './mail.service';

@Processor(QUEUES.mail.name)
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  private readonly logger = new Logger(MailProcessor.name);

  async process(job: Job): Promise<any> {
    const { signup } = QUEUES.mail.jobs;
    switch (job.name) {
      case signup:
        await this.mailService.sendMail({
          subject: 'New User registration',
          to: job.data.email,
          html: '<p>Hello</p> <b> bold</b>',
        });
        break;

      default:
        break;
    }
  }

  @OnWorkerEvent('error')
  onError(job, err) {
    this.logger.error('failed', job.name, err);
  }
}
