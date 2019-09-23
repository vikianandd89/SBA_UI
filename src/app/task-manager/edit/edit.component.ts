import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';

import { TaskItem } from '../../models/task-item';
import { TaskManagerService } from '../providers/task-manager.service';
import { SearchModalComponent } from '../../common/search-modal.component';
import { ActionType } from '../../enum/action-type';
import { Search } from '../../models/search';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { User } from '../../models/user';
import { UserManagerService } from '../../user-manager/providers/user-manager.service';
import { ProjectManagerService } from '../../project-manager/providers/project-manager.service';
import { StatusType } from '../../enum/status-type';

@Component({
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {

    @ViewChild('showmodal') showmodal:ElementRef;
    taskDetails:TaskItem[]
    taskDetail:TaskItem;
    updateTaskId:number
    results:string
    showError:boolean = false;
    modalRef: BsModalRef;
    selectedUser: User;
    status: StatusType;
    isParentTask: boolean = false;

    constructor(
        private taskManagerService:TaskManagerService,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private projectManagerService: ProjectManagerService,
        private userManagerService: UserManagerService,
        private router: Router
    ) { 
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.updateTaskId = params['id'];
        });

        this.taskManagerService.getAllTasks().subscribe(
        response => {
          this.taskDetail = response.find(x => x.id == this.updateTaskId);
          this.isParentTask = this.taskDetail.id === this.taskDetail.parentTaskId;
          this.taskDetails = response.filter(
            resElement => resElement.id !=  this.updateTaskId && !resElement.endTask) 
          },
        error => {
          if(error.status < 200 || error.status > 300)
          {    
            this.showError = true;     
            this.results = JSON.parse(error._body);          
          }
        });
    }

    onParentSelection(event) {
      this.isParentTask = event.target.checked;

      if (this.isParentTask) {
        this.onResetTask();
      }
    }

    onResetTask() {
      if (!this.taskDetail) {
        this.taskDetail = new TaskItem();
      }

      this.taskDetail.startDate = new Date();
      this.taskDetail.endDate = new Date(new Date().setDate((new Date().getDate() + 1)));
      this.taskDetail.priority = 0;
    }

    onUpdateTask() {
        this.taskManagerService.updateTask(this.taskDetail, this.taskDetail.id)
            .subscribe(response => {
                this.results = response;
                this.openModal();
                this.status = StatusType.Updated;
                if (!this.taskDetail.parentTaskId) {
                  if (this.selectedUser) {
                    this.selectedUser.taskId = this.taskDetail.id;
                    this.saveUser();
                  }
                } 
            },
            error => {
                if(error.status < 200 || error.status > 300)
                this.results = JSON.parse(error._body);
                this.openModal();
            }
      );
    }

  onCancel() {
    this.router.navigate(['/view']);
  }

  openModal() {
    this.showmodal.nativeElement.click();
  }

  closeModal() {
    this.router.navigate(['/view']);
  }

  showProjectModal() {
    this.modalRef = this.modalService.show(SearchModalComponent, { initialState: { actionType: ActionType.ViewProject } });
    this.modalRef.content.selectedId.subscribe(value => this.updateEmittedValue(value));
  }

  showUserModal() {
    this.modalRef = this.modalService.show(SearchModalComponent, { initialState: { actionType: ActionType.ViewUser } });
    this.modalRef.content.selectedId.subscribe(value => this.updateEmittedValue(value));
  }

  private updateEmittedValue(searchResponse: Search) {
    if (searchResponse.id) {
      switch (searchResponse.actionType) {
        case ActionType.ViewProject:
          const project = this.projectManagerService.Projects.find(t => t.id === searchResponse.id);
          this.taskDetail.projectId = project.id;
          this.taskDetail.projectName = project.name;
          break;
        case ActionType.ViewUser:
          this.selectedUser = this.userManagerService.Users.find(t => t.id === searchResponse.id);
          this.taskDetail.userId = this.selectedUser.id;
          this.taskDetail.userName = this.selectedUser.firstName;
          break;
      }
    }

    this.modalService.hide(1);
  }

  private saveUser(): void {
    this.userManagerService.updateUser(this.selectedUser).subscribe(() => {
    })
  }
}