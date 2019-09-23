import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProjectManagerService } from '../providers/project-manager.service';
import { Project } from '../../models/project';

@Component({
  selector: 'view-project',
  templateUrl: './view.component.html'
})

export class ViewProjectComponent implements OnInit {
  projects: Project[];
  projectForm: FormGroup;

  minStartDate = new Date();
  minEndDate = new Date(new Date().setDate((new Date().getDate() + 1)));

  constructor(private formBuilder: FormBuilder, private service: ProjectManagerService) { }

  ngOnInit(): void {
    this.getProjects();
    this.initialiseForm(undefined);
  }

  edit(request): void {
    this.initialiseForm(request);
  }

  delete(request): void {
    this.service.deleteProject(request).subscribe(() => {
      this.getProjects();
    });
  }

  getProjects(): void {
    this.service.getAllProjects().subscribe(response => {
      this.projects = response;
      this.service.Projects = response;
    });
  }

  private initialiseForm(project: Project): void {
    this.projectForm = this.formBuilder.group({
      id: project ? project.id : undefined,
      name: new FormControl(project ? project.name : undefined, Validators.required),
      enableDates: new FormControl(project && project.startDate ?  true : false),
      startDate: new FormControl(project ? new Date(project.startDate) : this.minStartDate, [Validators.required]),
      endDate: new FormControl(project ? new Date(project.endDate) : new Date(this.minEndDate), [Validators.required]),
      priority: new FormControl(project ? project.priority : 0),
      taskCount: project? project.taskCount : undefined,
      userId: project && project.user ? project.user.id : undefined,
      user: this.formBuilder.group({
        userId: project && project.user ? project.user.id : undefined,
        firstName: project && project.user ? project.user.firstName : undefined,
        lastName: project && project.user ? project.user.lastName : undefined
      })
    });
  }
}