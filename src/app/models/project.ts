import { User } from './user';

export class Project {
    constructor(
        public id: number,
        public name: string,
        public startDate: Date,
        public endDate: Date,
        public priority: number,
        public taskCount: number,
        public userId: string,
        public user: User) {
    }
}