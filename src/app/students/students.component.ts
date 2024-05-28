import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ExcelModule,
  GridDataResult,
  GridModule,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Student, StudentService } from '../service/student.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import {
  SVGIcon,
  editToolsIcon,
  fileExcelIcon,
  trashIcon,
} from '@progress/kendo-svg-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload/upload.component';
import { NotificationService } from '../service/notification.service';
import { NotificationService as ToastService } from '@progress/kendo-angular-notification';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    GridModule,
    InputsModule,
    ExcelModule,
    ButtonsModule,
    DialogsModule,
    CommonModule,
    UploadComponent,
    UpdateComponent,
  ],
  providers: [StudentService, NotificationService, ToastService],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  @ViewChild(UpdateComponent)
  public updateComponent!: UpdateComponent;
  public gridItems: GridDataResult | null = null;
  public pageSize: number = 10;
  public skip: number = 0;
  public sortDescriptor: SortDescriptor[] = [];
  public filterTerm: number | null = null;
  public excelSVG: SVGIcon = fileExcelIcon;
  public trashIcon: SVGIcon = trashIcon;
  public editToolsIcon: SVGIcon = editToolsIcon;
  public selectedStudent: Student | null = null;

  constructor(
    private service: StudentService,
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadGridItems();
    this.notifiactions();
  }

  notifiactions() {
    this.notificationService.notifications().subscribe({
      next: (data) => {
        this.toastService.show({
          content: data,
          cssClass: 'button-notification',
          animation: { type: 'slide', duration: 400 },
          position: { horizontal: 'center', vertical: 'top' },
          type: { style: 'success', icon: true },
          closable: true,
        });
        this.loadGridItems();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadGridItems();
  }

  loadGridItems() {
    const observable = this.service.students(this.pageSize, this.skip);

    if (observable) {
      const subscription = observable.subscribe({
        next: (data) => {
          if (data.data) {
            this.gridItems = {
              data: data.data.students.students,
              total: data.data.students.totalCount,
            };
          }
          subscription.unsubscribe();
        },
        error: (error) => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
    }
  }

  deleteStudent(student: Student) {
    this.selectedStudent = student;
  }

  close(action: string) {
    if (action === 'yes') {
      if (this.selectedStudent?.id) {
        const subscription = this.service
          .deleteStudent(this.selectedStudent.id)
          .subscribe({
            next: (data) => {
              subscription.unsubscribe();
              this.loadGridItems();
              this.selectedStudent = null;
            },
            error: (error) => {
              subscription.unsubscribe();
            },
          });
      }
    } else {
      this.selectedStudent = null;
    }
  }

  update(student: Student) {
    this.updateComponent.open(student);
  }
}
