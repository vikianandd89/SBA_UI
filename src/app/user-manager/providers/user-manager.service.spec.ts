import { TestBed, async } from '@angular/core/testing';
import { UserManagerService } from './user-manager.service';
import { of } from 'rxjs';
import { Project } from '../../models/project';
import { Http } from '@angular/http';

describe('User service', () => {
    let targetService: UserManagerService;
    let mockHttpClientService: jasmine.SpyObj<Http>;

    beforeEach(async(() => {
        const spy = jasmine.createSpyObj(Http.name, ['get', 'post', 'put', 'delete']);

        TestBed.configureTestingModule({
            providers: [ UserManagerService, { provide: Http, useValue: spy } ]
        });

        targetService = TestBed.get(UserManagerService);
        mockHttpClientService = TestBed.get(Http);
    }));

    it('get users from cache', () => {
        targetService.Users = [];
        expect(targetService.Users.length).toBe(0);
    });

    it('#getAllusers should return stubbed value from a spy', () => {
        const userResponse = [
            {
                UserId: "userid",
                FirstName: "Test first name",
                LastName: "Test last name",
                EmployeeId: 123,
                TaskId: undefined,
                ProjectId: 1,
                Task: undefined,
                Project: undefined,
            } 
        ] as any;

        const response = new Response(userResponse)
        mockHttpClientService.get.and.returnValue(of(response));

        targetService.getAllUsers();

        expect(mockHttpClientService.get).toHaveBeenCalled();
    });

    it('#adduser should post the value from the component to the service', () => {
        const request = {
            id: 1,
            firstName: "Test first name",
            lastName: "Test last name",
            employeeId: 123,
            taskId: undefined,
            projectId: 1,
            task: undefined,
            project: undefined,
        } as any;

        mockHttpClientService.post.and.returnValue(of("1"));
        targetService.addUser(request);

        expect(mockHttpClientService.post).toHaveBeenCalled();
    });

    it('#updateuser should post the value from the component to the service', () => {
        const request = {
            userId: "userid",
            firstName: "Test first name",
            lastName: "Test last name",
            employeeId: 123,
            taskId: undefined,
            projectId: 1,
            task: undefined,
            project: undefined,
        } as any;

        targetService.updateUser(request);

        expect(mockHttpClientService.put).toHaveBeenCalled();
    });

    it('#enduser should post the value from the component to the service', () => {
        const request = {
            userId: "userid",
            firstName: "Test first name",
            lastName: "Test last name",
            employeeId: 123,
            taskId: undefined,
            projectId: 1,
            task: undefined,
            project: undefined,
        } as any;

        targetService.deleteUser(request);

        expect(mockHttpClientService.delete).toHaveBeenCalled();
    });
});