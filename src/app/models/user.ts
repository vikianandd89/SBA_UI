import { TaskItem } from './task-item';
import { Project } from './project';

export class User {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public employeeId: number,
        public taskId?: number,
        public projectId?: number,
        public task?: TaskItem,
        public project?: Project) {
        }
}