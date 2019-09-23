import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { TaskItem } from '../../models/task-item';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
    
@Injectable()
export class TaskManagerService {
    baseUrl: string ="https://localhost:5001/api/tasks/";     

    constructor(private http: Http) {
    }

    getAllTasks(): Observable<TaskItem[]> {   
        return this.http.get(this.baseUrl).pipe(
            map(this.extractResponse)
        );      
    }

    getTask(Id:number):Observable<TaskItem>
    {   
        return this.http.get(this.baseUrl+Id).pipe(
            map((data:Response) => <TaskItem>data.json())
        );   
    }

    addTask(Item:TaskItem):Observable<string>
    {
        return this.http.post(this.baseUrl,Item).pipe(
            map((data:Response) => <string>data.json())
        );
    }

    updateTask(Item:TaskItem, Id:number):Observable<string>
    {
      return this.http.put(this.baseUrl+Id,Item).pipe(
        map((data:Response) => <string>data.json())
      );
    }

    private extractResponse(response: Response) {
        if (response.status < 200 || response.status >= 300) {
           throw new Error('Bad response status: ' + response.status);
        }
        let body = response.json(); // parse JSON string into JavaScript objects
    
        return body || { };
    }    
}