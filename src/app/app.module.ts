import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { AddComponent } from './task-manager/add/add.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskManagerService } from './task-manager/providers/task-manager.service';
import { ViewComponent } from './task-manager/view/view.component';
import { SearchPipe } from './task-manager/providers/search.pipe';
import { EditComponent } from './task-manager/edit/edit.component';
import { AddProjectComponent } from './project-manager/add/add.component';
import { ViewProjectComponent } from './project-manager/view/view.component';
import { BsDatepickerModule, ModalModule } from "ngx-bootstrap";
import { ProjectManagerService } from './project-manager/providers/project-manager.service';
import { UserManagerService } from './user-manager/providers/user-manager.service';
import { AddUserComponent } from './user-manager/add/add.commponent';
import { ViewUserComponent } from './user-manager/view/view.component';
import { SearchModalComponent } from './common/search-modal.component';
import { SearchTasksComponent } from './task-manager/search/search.component';

const appRoutes: Routes = [
  { path: "", component: ViewComponent },
  { path: "add", component: AddComponent, pathMatch : "full" },
  { path: "view", component: ViewComponent, pathMatch : "full" },
  { path: "edit", component: EditComponent, pathMatch : "full" },
  { path: "add-project", component: AddProjectComponent, pathMatch: "full" },
  { path: "view-project", component: ViewProjectComponent, pathMatch: "full" },
  { path: "add-user", component: AddUserComponent, pathMatch: "full" },
  { path: "view-user", component: ViewUserComponent, pathMatch: "full" }
]

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    ViewComponent,
    SearchPipe,
    EditComponent,
    ViewProjectComponent,
    AddProjectComponent,
    AddUserComponent,
    ViewUserComponent,
    SearchModalComponent,
    SearchTasksComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    TaskManagerService,
    ProjectManagerService,
    UserManagerService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SearchModalComponent]
})
export class AppModule { }
