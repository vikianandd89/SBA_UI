import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SortOrderType } from '../../enum/sort-order-type';
import { ActionType } from '../../enum/action-type';
import { ProjectManagerService } from '../../project-manager/providers/project-manager.service';
import { SearchModalComponent } from '../../common/search-modal.component';
import { Search } from '../../models/search';

@Component({
    templateUrl: './search.component.html',
    selector: 'search-tasks'
})

export class SearchTasksComponent {
    @Input() searchCriteriaForm: FormGroup;
    sortOrderType: SortOrderType;

    readonly SortOrder = SortOrderType;
    readonly ActionType = ActionType;

    modalRef: BsModalRef;

    constructor(
        private modalService: BsModalService,
        private projectService: ProjectManagerService) { 
            this.sortOrderType = SortOrderType.StartDate;
        }

    openModal(actionType: ActionType) {
        this.modalRef = this.modalService.show(SearchModalComponent, { initialState: { actionType: actionType } });
        this.modalRef.content.selectedId.subscribe(value => this.updateEmittedValue(value))
    }

    sortArray(event): void {
        this.sortOrderType = event.target.title;
        this.searchCriteriaForm.get("sortOrder").patchValue(SortOrderType[event.target.title]);
    }

    private updateEmittedValue(searchResponse: Search) {
        if (searchResponse.id) {
            const project = this.projectService.Projects.find(t => t.id === searchResponse.id);
            this.searchCriteriaForm.controls["projectId"].patchValue(project.id);
            this.searchCriteriaForm.controls["projectName"].patchValue(project.name);
        }

        this.modalService.hide(1);
    }
}