import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StatusType } from '../../enum/status-type';
import { UserManagerService } from '../providers/user-manager.service';
import { User } from '../../models/user';

@Component({
  selector: 'add-user',
  templateUrl: './add.component.html'
})

export class AddUserComponent implements OnInit {
  @Input() userForm: FormGroup;
  @Output() onSave = new EventEmitter<boolean>();

  status: StatusType;

  readonly Status = StatusType;
  isEditUser: boolean;

  get FirstNameControl(): AbstractControl {
    return this.userForm.get("firstName");
  }

  get LastNameControl(): AbstractControl {
    return this.userForm.get("lastName");
  }

  get EmployeeIdControl(): AbstractControl {
    return this.userForm.get("employeeId");
  }

  constructor(private service: UserManagerService) { }

  ngOnInit(): void {
    this.status = StatusType.None;
  }

  save(): void {
    const request = this.userForm.value;

    if (request && request.id) {
      this.service.updateUser(request).subscribe(() => {
        this.status = StatusType.Updated;
        this.userForm.reset();
        this.onSave.emit(true);
      });
    } else {
      this.service.addUser(request).subscribe(() => {
        this.status = StatusType.Added;
        this.userForm.reset();
        this.onSave.emit(true);
      });
    }
  }

  reset(): void {
    this.userForm.reset();
    this.status = StatusType.None;
  }
}
