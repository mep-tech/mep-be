import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import path from 'path';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { activitiesImageDirectory } from 'src/modules/activity/activity.controller';
import { ActivityService } from 'src/modules/activity/activity.service';
import { CreateActivityDto } from 'src/modules/activity/dto/create-activity.dto';

@Injectable()
export class ActivitySeed {
  constructor(
    private readonly activityService: ActivityService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Command({
    command: 'seed:activities',
    describe: 'seed activities',
  })
  async seeds (): Promise<void> {


    const data: CreateActivityDto[] = [
      {
        alias: 'Access Door control',
        name: 'Access Door control',
        image: path.join(__dirname, "../../../../assets/activities-images/access_door_control.jpeg")
      },
      {
        alias: 'Air Conditioning',
        name: 'Air Conditioning',
        image: path.join(__dirname, "../../../../assets/activities-images/air_conditioning.jpeg")
      },
      {
        alias: 'Architecture',
        name: 'Architecture',
        image: path.join(__dirname, "../../../../assets/activities-images/architecture.jpeg")
      },
      {
        alias: 'CCTV Camera',
        name: 'CCTV Camera',
        image: path.join(__dirname, "../../../../assets/activities-images/cctv.jpeg")
      },
      {
        alias: 'Electrical',
        name: 'Electrical',
        image: path.join(__dirname, "../../../../assets/activities-images/electrical_installation.jpeg")
      },
      {
        alias: 'Elevator',
        name: 'Elevator',
        image: path.join(__dirname, "../../../../assets/activities-images/Elevator.jpeg")
      },
      {
        alias: 'Fire Alarm',
        name: 'Fire Alarm',
        image: path.join(__dirname, "../../../../assets/activities-images/fire_alarm.jpeg")
      },
      {
        alias: 'Fire Fighting',
        name: 'Fire Fighting',
        image: path.join(__dirname, "../../../../assets/activities-images/fire_fighting.jpeg")
      },
      {
        alias: 'Internet',
        name: 'Internet',
        image: path.join(__dirname, "../../../../assets/activities-images/internet.jpeg")
      },
      {
        alias: 'Ip Telephone',
        name: 'Ip Telephone',
        image: path.join(__dirname, "../../../../assets/activities-images/ip_telephone.jpeg")
      },
      {
        alias: 'Maintenance',
        name: 'Maintenance',
        image: path.join(__dirname, "../../../../assets/activities-images/maintenance.jpeg")
      },
      {
        alias: 'Plastering',
        name: 'Plastering',
        image: path.join(__dirname, "../../../../assets/activities-images/plastering.jpeg")
      },
      {
        alias: 'Street Lights',
        name: 'Street Lights',
        image: path.join(__dirname, "../../../../assets/activities-images/street_lights.jpeg")
      },
      {
        alias: 'Transmission',
        name: 'Transmission',
        image: path.join(__dirname, "../../../../assets/activities-images/transmission_lines.jpeg")
      },
      {
        alias: 'Tv',
        name: 'Tv',
        image: path.join(__dirname, "../../../../assets/activities-images/tv.jpeg")
      },
      {
        alias: 'Water Pumps',
        name: 'Water Pumps',
        image: path.join(__dirname, "../../../../assets/activities-images/water_pumps.jpeg")
      },
    ];

    try {
      const activities = await Promise.all(
        data.map(async (activity) => {
          const file = { path: activity.image }
          const uploadedImage = await this.cloudinaryService.uploadImage(file, activitiesImageDirectory);
          return {
            ...activity,
            image: uploadedImage.secure_url
          }
        })
      )

      await this.activityService.createMany(activities);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:activities',
    describe: 'remove activities',
  })
  async remove (): Promise<void> {
    try {
      const activities = await this.activityService.findAll()
      const deleted = await this.activityService.removeMany(activities.flatMap((activity) => activity._id.toString()));
      console.log(`Deleted ${deleted.deletedCount} activities`)
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
