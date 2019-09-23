import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { TaskItem } from '../../models/task-item';
import { TaskManagerService } from '../providers/task-manager.service';
import { ProjectManagerService } from '../../project-manager/providers/project-manager.service';
import { UserManagerService } from '../../user-manager/providers/user-manager.service';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { SearchModalComponent } from '../../common/search-modal.component';
import { ActionType } from '../../enum/action-type';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Search } from '../../models/search';
import { StatusType } from '../../enum/status-type';

@Component({
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {

  @ViewChild('showmodal') showmodal:ElementRef;
  taskDetails:TaskItem[]
  projectDetails: Project[];
  userDetails: User[];
  public taskDetail:TaskItem;
  results:string
  modalRef: BsModalRef;
  selectedUser: User;
  status: StatusType;
  isParentTask: boolean = false;

  constructor(
    private taskManagerService: TaskManagerService,
    private projectManagerService: ProjectManagerService,
    private userManagerService: UserManagerService,
    private modalService: BsModalService,
    private router: Router
  ) { 
    this.onResetTask();
  }

  ngOnInit() {
    this.taskManagerService.getAllTasks().subscribe(
      taskDetails => {
        this.taskDetails = taskDetails.filter(taskItem => !taskItem.endTask);
      });
  }

  onParentTaskSelection(event): void {
    this.isParentTask = event.target.checked;

    if (this.isParentTask) {
      this.onResetTask();
    }
  }

  onAddTask() {
    this.taskManagerService.addTask(this.taskDetail).subscribe(response => {
      this.results = "Task " + response + " added successfully.";
      this.openModal();
      this.status = StatusType.Added;
      if (this.isParentTask) {
        this.taskDetail.id = +response;
        this.taskDetail.parentTaskId = +response;
        this.onUpdateTask();
      } else {
        if (this.selectedUser) {
          this.selectedUser.taskId = +response;
          this.saveUser();
        }
      }
    },
    error => {
      if(error.status < 200 || error.status > 300)
        this.results = JSON.parse(error._body);
        this.openModal();
    });
  }

  onUpdateTask() {
    this.taskManagerService.updateTask(this.taskDetail, this.taskDetail.id)
        .subscribe(response => {
        },
        error => {
            if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
            this.openModal();
        }
    );
  }

  onResetTask() {
    if (!this.taskDetail) {
      this.taskDetail = new TaskItem();
    }
    
    this.taskDetail.startDate = new Date();
    this.taskDetail.endDate = new Date(new Date().setDate((new Date().getDate() + 1)));
    this.taskDetail.priority = 0;
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
      this.onResetTask();
    })
  }
}