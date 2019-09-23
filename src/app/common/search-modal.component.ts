import { Component, Output, EventEmitter, Input } from '@angular/core';
import { TaskItem } from '../models/task-item';
import { Project } from '../models/project';
import { User } from '../models/user';
import { ActionType } from '../enum/action-type';
import { TaskManagerService } from '../task-manager/providers/task-manager.service';
import { ProjectManagerService } from '../project-manager/providers/project-manager.service';
import { UserManagerService } from '../user-manager/providers/user-manager.service';
import { Search } from '../models/search';

@Component({
    templateUrl: './search-modal.component.html'
})

export class SearchModalComponent {
    readonly ActionType = ActionType;

    taskDetails:TaskItem[]
    tasks: TaskItem[];
    projects: Project[];
    users: User[];

    @Input() actionType: ActionType;
    @Output() selectedId = new EventEmitter();

    constructor(
        private projectManagerService: ProjectManagerService,
        private taskManagerService: TaskManagerService,
        private userManagerService: UserManagerService) { }

    ngOnInit(): void {
        if (this.actionType === ActionType.ViewParentTask) {
            this.searchParentTasks();
        } else if (this.actionType === ActionType.ViewProject) {
            this.searchProjects();
        } else if (this.actionType === ActionType.ViewUser) {
            this.searchUser();
        }
    }

    private searchParentTasks(): void {
        this.taskManagerService.getAllTasks()
        .subscribe(
            p => this.taskDetails = p.filter(res => !res.endTask)
        );
    };

    private searchProjects(): void {
        this.projectManagerService.getAllProjects().subscribe((response) => {
            this.projectManagerService.Projects = response;
            this.projects = response;
        });
    }

    private searchUser(): void {
        this.userManagerService.getAllUsers().subscribe((response) => {
            this.userManagerService.Users = response;
            this.users = response;
        });
    }

    onSelection(id: number): void {
        this.selectedId.emit({ actionType: this.actionType, id: id } as Search);
    }
}
