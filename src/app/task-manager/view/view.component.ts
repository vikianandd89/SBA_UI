import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TaskItem } from '../../models/task-item';
import { TaskManagerService } from '../providers/task-manager.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SortOrderType } from '../../enum/sort-order-type';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {
    @ViewChild('showmodal') showmodal:ElementRef;
    searchResponse: TaskItem[];
    taskDetails:TaskItem[] = [];
    searchCriteriaForm: FormGroup;
    taskDetail:TaskItem;
    results:string;
    showError:boolean = false;
    
    constructor(
        private formBuilder: FormBuilder,
        private service: TaskManagerService,
        private router: Router, private location:Location
    ) {
    } 

    ngOnInit() {
    this.intitialiseFormGroup();
    this.service.getAllTasks().subscribe(response => {        
        (response as TaskItem[]).forEach(element => {
            let taskDetail = (response as TaskItem[]).find(res=> res.id == element.parentTaskId);
            if(taskDetail != undefined) {
                element.parentName = taskDetail.name;
            }
            else {     
                element.parentName = "Task has no parent";
            }
        }); 

      this.taskDetails = response;
      this.searchCriteriaForm.patchValue({
        sortOrder: "StartDate"
      });
      this.showError = false;
    },
    error => {
        if(error.status < 200 || error.status > 300)
        {    
          this.showError = true;     
          this.results = JSON.parse(error._body);          
        }
    });    
  }

  edit(taskId) {
    this.router.navigate(['/edit'], { queryParams: { id: taskId} });
  }

  endTask(taskId) {
   
    this.taskDetail =  this.taskDetails.find(taskElement => taskElement.id == taskId);  
    this.taskDetail.endTask = true;
    this.service.updateTask(this.taskDetail, this.taskDetail.id).subscribe(response => 
    {
        if(response.length > 0) {
            this.results = this.taskDetail.name + " has been closed successfully";
        }
          
        this.openModal();
      },
      error => {
        if(error.status < 200 || error.status > 300) {
          this.taskDetail.endTask = false;
          this.results = error.statusText + "-" + JSON.parse(error._body);
          this.openModal();
        }
      }
    );
  }

  openModal() {
    this.showmodal.nativeElement.click();
  }

  closeModal() {
   // location.reload();
  }

  private intitialiseFormGroup(): void {
    this.searchCriteriaForm = this.formBuilder.group({
      projectId: undefined,
      projectName: undefined,
      sortOrder: undefined
    });

    this.searchCriteriaForm.get("projectId").valueChanges.subscribe(projectId => {
      this.searchResponse = this.taskDetails.filter(x => x.projectId === projectId);
    });

    this.searchCriteriaForm.get("sortOrder").valueChanges.subscribe((sortBy: SortOrderType) => {
      if (!this.searchResponse) {
        this.searchResponse = this.taskDetails;
      }

      switch (sortBy) {
        case SortOrderType.Priority:
          this.searchResponse = this.searchResponse.sort(function (a, b) {
            if (a.priority < b.priority) { return -1; }
            if (a.priority > b.priority) { return 1; }
            return 0;
          });
          break;
        case SortOrderType.Completed:
          this.searchResponse = this.searchResponse.sort(function (a, b) {
            if (a.endTask < b.endTask) { return -1; }
            if (a.endTask > b.endTask) { return 1; }
            return 0;
          });
          break;
        case SortOrderType.StartDate:
          this.searchResponse = this.searchResponse.sort(function (a, b) {
            if (a.startDate < b.startDate) { return -1; }
            if (a.startDate > b.startDate) { return 1; }
            return 0;
          });
          break;
        default:
          this.searchResponse = this.searchResponse.sort(function (a, b) {
            if (a.endDate < b.endDate) { return -1; }
            if (a.endDate > b.endDate) { return 1; }
            return 0;
          });
          break;
      }
    });
  }
}