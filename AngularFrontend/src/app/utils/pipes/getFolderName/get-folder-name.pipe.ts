import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFolderName'
})
export class GetFolderNamePipe implements PipeTransform {

  transform(value:any) {
    let splittedPath =  value.split('/');
    return splittedPath[splittedPath.length - 1]
  }

}
