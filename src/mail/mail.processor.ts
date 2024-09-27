import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { QUEUES } from '@/utils/constants';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Processor(QUEUES.mail.name)
export class MailProcessor extends WorkerHost {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  private readonly logger = new Logger(MailProcessor.name);

  async process(job: Job): Promise<any> {
    const { signup } = QUEUES.mail.jobs;
    switch (job.name) {
      case signup:
        const { userId, email, cypherString } = job.data || {};
        await this.mailService.sendMail({
          subject: 'New User registration',
          to: email,
          html: this.generateVerificationEmail(userId, cypherString),
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

  private generateVerificationEmail(
    userId: string,
    cypherString: string,
  ): string {
    const verifyLink = `https://${this.configService.get('client.baseUrl')}/set-password?token=${cypherString}&user=${userId}`;

    return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to Our Platform!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">Verify Email</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }
}
