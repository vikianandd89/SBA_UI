import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModalComponent } from './search-modal.component';
import { of } from 'rxjs';
import { ProjectManagerService } from '../project-manager/providers/project-manager.service';
import { TaskManagerService } from '../task-manager/providers/task-manager.service';
import { UserManagerService } from '../user-manager/providers/user-manager.service';
import { User } from '../models/user';
import { Project } from '../models/project';
import { ActionType } from '../enum/action-type';

describe('Search Modal component', () => {
    let component: SearchModalComponent;
    let mockTaskManagerService: TaskManagerService;
    let mockProjectService: ProjectManagerService;
    let mockUserService: UserManagerService;

    const user = new User(1, "firstName", "lastName", 123456, 1, 2, null, null);
    const project = new Project(2, "project name", new Date(), new Date(), 1, 5, "userId", user);
    const taskDetails : any[] = [
        { "id": 101, "name": "Task 101", "startDate": "2018-07-23",
            "endDate" :"2018-07-28", "priority":10,"endTask":false,
            "parentTaskId":2, "parentName":"parent" },
        ];

    beforeEach(async(() => {
        mockTaskManagerService = jasmine.createSpyObj(TaskManagerService.name, ["getAllTasks"]);
        (mockTaskManagerService.getAllTasks as jasmine.Spy).and.returnValue(of([taskDetails]));

        mockProjectService = jasmine.createSpyObj(ProjectManagerService.name, ["getAllProjects"]);
        (mockProjectService.getAllProjects as jasmine.Spy).and.returnValue(of([project]));

        mockUserService = jasmine.createSpyObj(UserManagerService.name, ["getAllUsers"]);
        (mockUserService.getAllUsers as jasmine.Spy).and.returnValue(of([user]));

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                SearchModalComponent
            ],
            providers: [
                { provide: TaskManagerService, useValue: mockTaskManagerService },
                { provide: ProjectManagerService, useValue: mockProjectService },
                { provide: UserManagerService, useValue: mockUserService }
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(SearchModalComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should load the parent task details', () => {
        component.actionType = ActionType.ViewParentTask
        component.ngOnInit();
    });

    it('should load the project details', () => {
        component.actionType = ActionType.ViewProject
        component.ngOnInit();
    });

    it('should load the user details', () => {
        component.actionType = ActionType.ViewUser
        component.ngOnInit();
    });
});
