import { TestBed, async } from '@angular/core/testing';
import { ProjectManagerService } from './project-manager.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../models/project';
import { Http } from '@angular/http';

describe('Project service', () => {
    let targetService: ProjectManagerService;
    let mockHttpClientService: jasmine.SpyObj<Http>;

    beforeEach(async(() => {
        const spy = jasmine.createSpyObj(Http.name, ['get', 'post', 'put', 'delete']);

        TestBed.configureTestingModule({
            providers: [ ProjectManagerService, { provide: Http, useValue: spy }]
        });

        targetService = TestBed.get(ProjectManagerService);
        mockHttpClientService = TestBed.get(Http);
    }));

    it('get projects from cache', () => {
        targetService.Projects = [];
        expect(targetService.Projects.length).toBe(0);
    });

    it('#getAllprojects should return stubbed value from a spy', () => {
        const projectResponse = [
            {
                id: "projectid",
                name: "Test project name",
                lastName: "Test last name",
                startDate: new Date(),
                endDate: new Date(),
                priority: 1,
                taskCount: 10,
                userId: undefined,
                user: undefined
            } 
        ] as any;

        const resposne = new Response(projectResponse);
        mockHttpClientService.get.and.returnValue(of(resposne));

        targetService.getAllProjects();

        expect(mockHttpClientService.get).toHaveBeenCalled();
    });

    it('#addproject should post the value from the component to the service', () => {
        const request = {
            id: "projectid",
            name: "Test project name",
            startDate: new Date(),
            endDate: new Date(),
            priority: 1,
            taskCount: 10,
            userId: undefined,
            user: undefined
        } as any;

        targetService.addProject(request);

        expect(mockHttpClientService.post).toHaveBeenCalled();
    });

    it('#updateproject should post the value from the component to the service', () => {
        const request = {
            id: "projectid",
            name: "Test project name",
            startDate: new Date(),
            endDate: new Date(),
            priority: 1,
            taskCount: 10,
            userId: undefined,
            user: undefined
        } as any;

        targetService.updateProject(request);

        expect(mockHttpClientService.put).toHaveBeenCalled();
    });

    it('#endproject should post the value from the component to the service', () => {
        const request = {
            id: "projectid",
            name: "Test project name",
            startDate: new Date(),
            endDate: new Date(),
            priority: 1,
            taskCount: 10,
            userId: undefined,
            user: undefined
        } as any;

        targetService.deleteProject(request);

        expect(mockHttpClientService.delete).toHaveBeenCalled();
    });
});