import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UsePipes,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthGuard, UserAuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { CustomValidationPipe, ParamObjectIdValidationPipe } from 'src/common/pipes/validation.pipe';
import { memberValidation } from './validations/member.validation';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { IResponse } from 'src/common/interface/response.interface';
import { MemberDocument } from './schema/member.schema';
import { MemberService } from './member.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @AuthGuard()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(new CustomValidationPipe(memberValidation))
  async create (
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<MemberDocument>> {
    try {
      const { names } = createMemberDto;
      const lastMember = await this.memberService.findLastMember();
      const order = lastMember ? lastMember.order + 1 : 1;
      const memberExists = await this.memberService.findOneByName(names);
      if (memberExists) {
        throw new HttpException(
          `Member ${names} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const file =
        image &&
        (await this.cloudinaryService.uploadImage(image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));
      const member = await this.memberService.create({
        ...createMemberDto,
        order,
        image: file?.secure_url,
      });
      return {
        statusCode: 201,
        message: 'Member added successfully',
        data: member,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll (): Promise<IResponse<MemberDocument[]>> {
    try {
      const members = await this.memberService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Members retrieved successfully',
        data: members,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UsePipes(ParamObjectIdValidationPipe)
  async findOne (@Param('id') id: string): Promise<IResponse<MemberDocument>> {
    try {
      const member = await this.memberService.findOne(id);
      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Member retrieved successfully',
        data: member,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @AuthGuard()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(ParamObjectIdValidationPipe)
  async update (
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<MemberDocument>> {
    try {
      const member = await this.memberService.findOne(id);
      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }
      const { order: currentOrder } = member;
      const { order: newOrder } = updateMemberDto;
      if (newOrder !== currentOrder) {
        const members = await this.memberService.findAll();
        const totalMembers = members.length;
        if (newOrder < currentOrder) {
          if (newOrder < 1) {
            throw new HttpException(
              'Invalid order value. Order must be greater than or equal to 1',
              HttpStatus.BAD_REQUEST,
            );
          }
          const updatedMembers = members.map((m) => {
            if (m.order >= newOrder && m.order < currentOrder) {
              m.order += 1;
            } else if (m.order === currentOrder) {
              m.order = newOrder;
            }
            return m;
          });
          await Promise.all(
            updatedMembers.map((m) =>
              this.memberService.update(m.id, { order: m.order }),
            ),
          );
        } else if (newOrder > currentOrder) {
          if (newOrder > totalMembers) {
            throw new HttpException(
              `Invalid order value. Order must be less than or equal to ${totalMembers}`,
              HttpStatus.BAD_REQUEST,
            );
          }
          const updatedMembers = members.map((m) => {
            if (m.order > currentOrder && m.order <= newOrder) {
              m.order -= 1;
            } else if (m.order === currentOrder) {
              m.order = newOrder;
            }
            return m;
          });
          await Promise.all(
            updatedMembers.map((m) =>
              this.memberService.update(m.id, { order: m.order }),
            ),
          );
        }
      }
      const file =
        image &&
        (await this.cloudinaryService.uploadImage(image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));
      const newMember = await this.memberService.update(id, {
        ...updateMemberDto,
        image: image && file?.secure_url,
      });
      if (image && member.image)
        await this.cloudinaryService.removeImage(member.image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });
      return {
        statusCode: HttpStatus.OK,
        message: 'Member updated successfully',
        data: newMember,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe)
  async remove (@Param('id') id: string): Promise<IResponse<void>> {
    try {
      const member = await this.memberService.findOne(id);
      if (!member) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }
      const { order } = member;
      const members = await this.memberService.findAll();
      const updatedMembers = members.map((m) => {
        if (m.order > order) {
          m.order -= 1;
        }
        return m;
      });
      await Promise.all(
        updatedMembers.map((m) =>
          this.memberService.update(m.id, { order: m.order }),
        ),
      );
      const deletedMember = await this.memberService.remove(id);
      if (!deletedMember) {
        throw new HttpException(
          'Failed to delete member',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (member.image) {
        await this.cloudinaryService.removeImage(member.image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Member deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
