import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate, CertificateDocument } from './schema/certificate.schema';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
  ) {}
  async create(
    createCertificateDto: CreateCertificateDto,
  ): Promise<CertificateDocument> {
    return await this.certificateModel.create(createCertificateDto);
  }

  async findAll(): Promise<CertificateDocument[]> {
    return await this.certificateModel.find().sort({ order: 1 });
  }

  async findOne(id: string): Promise<CertificateDocument> {
    return await this.certificateModel.findById(id);
  }

  async findOneByName(names: string): Promise<CertificateDocument> {
    return await this.certificateModel.findOne({ names });
  }

  async findLastCertificate(): Promise<CertificateDocument> {
    return await this.certificateModel.findOne().sort({ order: -1 });
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<CertificateDocument> {
    return await this.certificateModel.findByIdAndUpdate(
      id,
      updateCertificateDto,
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<CertificateDocument> {
    return await this.certificateModel.findByIdAndDelete(id);
  }
}
