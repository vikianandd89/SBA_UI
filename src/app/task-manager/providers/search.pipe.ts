import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskItem } from '../../models/task-item';

@Pipe({
  name: 'searchPipe',
})
export class SearchPipe implements PipeTransform {
    datePipe : DatePipe;

    constructor() {
        this.datePipe = new DatePipe('en-US');
    }
 
    transform(items: TaskItem[], nameSearch: any, parentTaskSearch: string, 
        priorityFromSearch: number, priorityToSearch: number,
        startDateSearch :string, endDateSearch:string){
        if (items && items.length){
            return items.filter(item => { 
                if (nameSearch && item.name.toLowerCase().indexOf(nameSearch.toLowerCase()) === -1)
                return false;
                
                if (parentTaskSearch && item.parentName.toLowerCase()
                    .indexOf(parentTaskSearch.toLowerCase()) === -1)
                    return false;
                
                if (priorityFromSearch && item.priority < priorityFromSearch)            
                    return false;
                
                if (priorityToSearch && item.priority > priorityToSearch)            
                    return false;
                
                if (startDateSearch) {
                    var startDateResult = this.datePipe.transform(item.startDate,'yyyy-MM-dd');            
                    if(startDateResult != startDateSearch)            
                    return false;            
                }

                if (endDateSearch) {
                    var endDateResult = this.datePipe.transform(item.endDate,'yyyy-MM-dd');
                    if(endDateResult != endDateSearch)            
                    return false; 
                }
            
                return true;
            })
        }
        else {
            return items;
        }
    }
}