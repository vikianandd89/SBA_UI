import { TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add.commponent';
import { UserManagerService } from '../providers/user-manager.service';
import { StatusType } from '../../enum/status-type';

describe('Add User component', () => {
    let component: AddUserComponent;
    let mockUserManagerService: UserManagerService;

    beforeEach(async(() => {
        mockUserManagerService = jasmine.createSpyObj(UserManagerService.name, ["addUser", "updateUser"]);
        (mockUserManagerService.addUser as jasmine.Spy).and.returnValue(of({}));
        (mockUserManagerService.updateUser as jasmine.Spy).and.returnValue(of({}));

        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                AddUserComponent
            ],
            providers: [
                { provide: UserManagerService, useValue: mockUserManagerService }
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(AddUserComponent);
        component = fixture.debugElement.componentInstance;
        component.userForm = new FormBuilder().group({
            id: undefined,
            firstName: "first name",
            lastName: "last name",
            employeeId: 111,
            projectId: undefined,
            taskId: undefined
        });

        component.ngOnInit();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should call the add user on save', () => {
        component.save();
        expect(mockUserManagerService.addUser).toHaveBeenCalled();
    });
    
    it('should set status type to none on clickng reset', () => {
        component.reset();
        expect(component.status).toBe(StatusType.None);
    });

    it('should call the update user on save', () => {
        component.userForm.patchValue({ id: 1 });
        component.save();
        expect(mockUserManagerService.updateUser).toHaveBeenCalled();
    });

})