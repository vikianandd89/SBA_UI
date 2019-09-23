import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserManagerService } from '../providers/user-manager.service';

@Component({
  selector: 'view-user',
  templateUrl: './view.component.html'
})

export class ViewUserComponent implements OnInit {
  users: User[];
  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userManagerService: UserManagerService) { }

  ngOnInit(): void {
    this.getUsers();
    this.initialiseForm(undefined);
  }

  edit(request): void {
    this.initialiseForm(request);
  }

  delete(request): void {
    this.userManagerService.deleteUser(request).subscribe(() => {
      this.getUsers();
    });
  }

  getUsers(): void {
    this.userManagerService.getAllUsers().subscribe(response => {
      this.users = response;
      this.userManagerService.Users = response;
    });
  }

  private initialiseForm(user: User): void {
    this.userForm = this.formBuilder.group({
      id: user ? user.id : undefined,
      firstName: new FormControl(user ? user.firstName : undefined, Validators.required),
      lastName: new FormControl(user ? user.lastName : undefined, Validators.required),
      employeeId: new FormControl(user ? user.employeeId : undefined, [Validators.required, Validators.pattern('^[0-9]*$')]),
      projectId: undefined,
      taskId: undefined
    });
  }
}