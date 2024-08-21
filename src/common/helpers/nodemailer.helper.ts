import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerHelper {
  private transporter: any;

  constructor(private readonly configService: ConfigService) {
    this.createTransporter();
  }

  private async createTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SENDER_EMAIL'),
        pass: this.configService.get<string>('APP_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<any> {
    const mailOptions = {
      from: {
        name: 'Mep Erictric',
        address: this.configService.get('SENDER_EMAIL'),
      },
      to: to,
      subject: subject,
      html: text,
    };

    return new Promise((res, rej) => {
      this.transporter.sendMail(mailOptions, (error: any, info: any): any => {
        if (error) {
          rej(error);
        } else {
          res(info);
        }
      });
    });
  }
}
