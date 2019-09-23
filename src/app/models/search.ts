import { ActionType } from "../enum/action-type";

export class Search {
    constructor(
        public id: number,
        public actionType: ActionType
    ) {}
}