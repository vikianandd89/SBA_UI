import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';
import { ViewComponent } from './view.component';
import { TaskManagerService } from '../providers/task-manager.service';
import { from, of as observableOf, throwError, of } from 'rxjs';
import { MockTaskManagerService } from '../providers/task-manager.service.spec';
import { SearchPipe } from '../providers/search.pipe';
import { SearchTasksComponent } from '../search/search.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ProjectManagerService } from '../../project-manager/providers/project-manager.service';
import { ActionType } from '../../enum/action-type';
import { Search } from '../../models/search';

describe('TaskmgrViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let service : TaskManagerService; 
  let formBuilder = new FormBuilder();
  let mockModalService: BsModalService;
  let mockProjectManagerService: ProjectManagerService;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')  
  };
  const TaskDetails : any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":false, "parentTaskId":null, "parentName":null },
    { "id": 102, "name": "Task 102", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":true, "parentTaskId":null, "parentName":null },
    { "id": 103, "name": "Task 103", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":true, "parentTaskId":102, "parentName":null },
    { "id": 104, "name": "Task 104", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":false, "parentTaskId":101, "parentName":null},
    ];
  beforeEach(async(() => {
    mockModalService = jasmine.createSpyObj(BsModalService.name, ["show", "hide"]);
    (mockModalService.hide as jasmine.Spy).and.returnValue(new BsModalRef());

    mockModalService.show = (): BsModalRef => {
        return { hide: null, content: { selectedId: of(new Search(1, ActionType.ViewUser)) } };
    };

    mockProjectManagerService = jasmine.createSpyObj(ProjectManagerService.name, ["getAllProjects"]);

    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, ReactiveFormsModule ],
      declarations: [ ViewComponent, SearchTasksComponent ],
      providers: [
        { provide: TaskManagerService, useClass: MockTaskManagerService},
        { provide: ProjectManagerService, useValue: mockProjectManagerService},
        { provide: FormBuilder, useValue: formBuilder },
        { provide: BsModalService, useValue: mockModalService },
        { provide: ActivatedRoute, useValue: { 'queryParams': from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    component.searchCriteriaForm = formBuilder.group({
      projectId: undefined,
      projectName: undefined,
      sortOrder: undefined
    });
    service = TestBed.get(TaskManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should have 4 task details', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));   
    component.ngOnInit();
    expect(4).toBe(component.taskDetails.length);  
    expect(service.getAllTasks).toHaveBeenCalled();   
  })

  it('Should have correct parent name', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));   
    component.ngOnInit();    
    expect("Task 102").toBe(component.taskDetails[2].parentName);  
    expect("Task 101").toBe(component.taskDetails[3].parentName);  
    expect("Task has no parent").toBe(component.taskDetails[0].parentName);  
    expect("Task has no parent").toBe(component.taskDetails[1].parentName);  
    expect(service.getAllTasks).toHaveBeenCalled();   
  })

  it('NgOnInit should handle Internal server error', () => { 
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service,'getAllTasks').and.returnValue(throwError(error));
    component.ngOnInit();     
    expect("Internal server error").toBe(component.results);
    expect(service.getAllTasks).toHaveBeenCalled();   
  });

  it('OnNgOnInit showError should True', () => { 
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service,'getAllTasks').and.returnValue(throwError(error));
    component.ngOnInit();     
    expect(true).toBe(component.showError);
    expect(service.getAllTasks).toHaveBeenCalled();   
  });

  it('End Task should return success message', () => {
    component.taskDetails = TaskDetails;   
    spyOn(service, 'updateTask').and.returnValue(observableOf("SUCCESS"));
    component.endTask(101);   
    expect("Task 101 has been closed successfully").toBe(component.results);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101);    
  });

  it('End Task should be True', () =>
  {   
    component.taskDetails = TaskDetails;   
    spyOn(service,'updateTask').and.returnValue(observableOf("SUCCESS"));
    component.endTask(101);   
    expect(true).toBe(TaskDetails[0].endTask);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101);    
  });

  it('EndTask should handle Internal server error', () => {
    component.taskDetails = TaskDetails;
    var error = { status: 500,statusText:"500", _body :'"Internal server error"'};
    spyOn(service, 'updateTask').and.returnValue(throwError(error));
    component.endTask(101);     
    expect("500-Internal server error").toBe(component.results);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101); 
  });

  it('EndTask should handle Internal server error and End Task should be False', () => {
    component.taskDetails = TaskDetails;
    var error = { status: 500,statusText:"500", _body :'"Internal server error"'};
    spyOn(service, 'updateTask').and.returnValue(throwError(error));
    component.endTask(101);     
    expect("500-Internal server error").toBe(component.results);
    expect(false).toBe(TaskDetails[0].endTask);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101); 
  });

  it('Edit method should go to Edit Route', () => {
    component.edit(101);     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit'], Object({ queryParams: Object({ id: 101 }) }));
  })
});