import { Pipe, PipeTransform } from '@angular/core';
import {formatDistanceToNow} from 'date-fns'

@Pipe({
  name: 'timeago',
  standalone: true
})
export class TimeagoPipe implements PipeTransform {

  transform(date: Date | string): string {
    const now = new Date();
    const pastDate = new Date(date);
    const differenceInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < 3600) {
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      return `${differenceInMinutes} minutes ago`;
    } else if (differenceInSeconds < 86400) {
      const differenceInHours = Math.floor(differenceInSeconds / 3600);
      return `${differenceInHours} hours ago`;
    } else if (differenceInSeconds < 2592000) { 
      const differenceInDays = Math.floor(differenceInSeconds / 86400);
      return `${differenceInDays} days ago`;
    } else if (differenceInSeconds < 31536000) { 
      const differenceInMonths = Math.floor(differenceInSeconds / 2592000);
      return `${differenceInMonths} months ago`;
    } else {
      const differenceInYears = Math.floor(differenceInSeconds / 31536000);
      return `${differenceInYears} years ago`;
    }
  
  }

}
