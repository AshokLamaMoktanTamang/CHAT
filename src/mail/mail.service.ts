import { Queue } from 'bullmq';
import { google } from 'googleapis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import { QUEUES } from '@/utils/constants';
import { OAuth2Client } from 'google-auth-library';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private oAuth2Auth: any;
  private oAuth2Client: OAuth2Client;

  constructor(
    @InjectQueue(QUEUES.mail.name) private readonly mailQueue: Queue,
    private readonly config: ConfigService,
  ) {
    this.oAuth2Auth = this.config.get('google');
    this.oAuth2Client = new google.auth.OAuth2(
      this.oAuth2Auth.clientId,
      this.oAuth2Auth.clientSecret,
      this.oAuth2Auth.redirectUri,
    );

    this.oAuth2Client.setCredentials({
      refresh_token: this.oAuth2Auth.refreshToken,
    });
  }

  async addToQueue(data) {
    await this.mailQueue.add(QUEUES.mail.jobs.signup, data);
  }

  async sendMail(data: SendMailDto) {
    const accessToken = await this.oAuth2Client.getAccessToken();

    if (!accessToken.token)
      throw new HttpException(
        'Failed to get google access token',
        HttpStatus.FAILED_DEPENDENCY,
      );

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: this.oAuth2Auth.emailUser,
        clientId: this.oAuth2Auth.clientId,
        clientSecret: this.oAuth2Auth.clientSecret,
        refreshToken: this.oAuth2Auth.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions: MailOptions = {
      from: this.oAuth2Auth.emailUser,
      ...data,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  }
}
