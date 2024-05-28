import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { StudentsComponent } from './students.component';
import { HttpClientModule } from '@angular/common/http';
import {
  DeletedStudent,
  Student,
  StudentService,
  studentData,
  students,
} from '../service/student.service';
import { NotificationService } from '../service/notification.service';
import { NotificationService as ToastService } from '@progress/kendo-angular-notification';
import { UpdateComponent } from './update/update.component';
import { of } from 'rxjs';
import { Apollo, MutationResult } from 'apollo-angular';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from '@apollo/client';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;
  let sudentService: StudentService;
  let mockApollo: jasmine.SpyObj<Apollo>;

  // Mock the Socket service
  const mockSocket = {
    fromEvent: () => of('Notification message'),
  };

  // Mock the NotificationService with the mocked Socket service
  const mockNotificationService = {
    notifications: () => mockSocket.fromEvent(),
  };

  // Mock the mockToastService
  const mockToastService = {
    show: (options: any) => {
      console.log('Toast shown:', options);
    },
  };

  beforeEach(async () => {
    mockApollo = jasmine.createSpyObj('Apollo', ['query', 'mutate']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        SocketIoModule,
        UpdateComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        StudentService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ToastService, useValue: mockToastService },
        { provide: Apollo, useValue: mockApollo },
        { provide: Socket, useValue: mockSocket },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    sudentService = TestBed.inject(StudentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize gridItems, pageSize, skip, sortDescriptor, filterTerm, excelSVG, trashIcon, editToolsIcon, and selectedStudent properties correctly', () => {
    expect(component.gridItems).toBeNull();
    expect(component.pageSize).toEqual(10);
    expect(component.skip).toEqual(0);
    expect(component.sortDescriptor).toEqual([]);
    expect(component.filterTerm).toBeNull();
    expect(component.excelSVG).toBeDefined();
    expect(component.trashIcon).toBeDefined();
    expect(component.editToolsIcon).toBeDefined();
    expect(component.selectedStudent).toBeNull();
  });

  it('should call loadGridItems and notifications on ngOnInit', () => {
    spyOn(component, 'loadGridItems').and.callFake(() => {
      return new Promise((resolve) => resolve(true));
    });
    spyOn(component, 'notifiactions').and.callFake(() => {
      return new Promise((resolve) => resolve(true));
    });

    component.ngOnInit();

    expect(component.loadGridItems).toHaveBeenCalled();
    expect(component.notifiactions).toHaveBeenCalled();
  });

  it('should load grid items correctly', fakeAsync(() => {
    const mockStudents: MutationResult<studentData> = {
      data: {
        students: {
          students: [
            {
              id: '1',
              name: 'John',
              email: 'test@gmail.com',
              birthDate: new Date(),
              age: 10,
            },
          ],
          totalCount: 1,
        },
      },
    };
    spyOn(sudentService, 'students').and.returnValue(of(mockStudents));
    fixture.detectChanges();
    component.loadGridItems();
    expect(component.gridItems).toBeDefined();
  }));

  it('should update skip value on page change', () => {
    const event: PageChangeEvent = { skip: 10, take: 0 };
    component.pageChange(event);
    expect(component.skip).toEqual(event.skip);
  });

  it('should call loadGridItems function on page change', () => {
    spyOn(component, 'loadGridItems');
    const event: PageChangeEvent = { skip: 10, take: 0 };
    component.pageChange(event);
    expect(component.loadGridItems).toHaveBeenCalled();
  });

  // describe('close', () => {
  //   it('should delete the selected student if action is "yes"', () => {
  //     // Arrange
  //     const mockSelectedStudent: Student = {
  //       id: '1',
  //       name: 'John',
  //       email: 'test@gmail.com',
  //       birthDate: new Date(),
  //       age: 10,
  //     };
  //     const mockValue:Observable<MutationResult<DeletedStudent>> = new Observable.of({
  //       data:{
          
  //       }
  //     })

  //     spyOn(sudentService, 'deleteStudent')
  //       .withArgs(mockSelectedStudent.id)
  //       .and.returnValue(
  //         Observable<>.of({
  //           data: {
  //             deleteStudent: {
  //               id: '1',
  //               name: 'John',
  //               email: 'test@gmail.com',
  //               birthDate: new Date(),
  //               age: 10,
  //             },
  //           },
  //         })
  //       );

  //     // Act
  //     component.selectedStudent = mockSelectedStudent;
  //     fixture.detectChanges();

  //     component.close('yes');

  //     // Assert
  //     expect(sudentService.deleteStudent).toHaveBeenCalledWith(
  //       mockSelectedStudent.id
  //     );
  //     expect(component.selectedStudent).toBeNull();
  //   });

  //   it('should not delete the selected student if action is not "yes"', () => {
  //     // Arrange
  //     const mockSelectedStudent: Student = {
  //       id: '1',
  //       name: 'John',
  //       email: 'test@gmail.com',
  //       birthDate: new Date(),
  //       age: 10,
  //     };

  //     spyOn(sudentService, 'deleteStudent')
  //       .withArgs(mockSelectedStudent.id)
  //       .and.returnValue(of({}));

  //     // Act
  //     component.selectedStudent = mockSelectedStudent;
  //     component.close('no');

  //     // Assert
  //     expect(sudentService.deleteStudent).not.toHaveBeenCalled();
  //     expect(component.selectedStudent).toBeNull();
  //   });
  // });

  describe('deleteStudent', () => {
    it('should set selectedStudent', () => {
      const mockStudent: Student = {
        id: '1',
        name: 'John',
        email: 'test@gmail.com',
        birthDate: new Date(),
        age: 10,
      };

      component.deleteStudent(mockStudent);

      expect(component.selectedStudent).toEqual(mockStudent);
    });
  });

  describe('update', () => {
    it('should open updateComponent with student', () => {
      const mockStudent: Student = {
        id: '1',
        name: 'John',
        email: 'test@gmail.com',
        birthDate: new Date(),
        age: 10,
      };

      spyOn(component.updateComponent, 'open');

      component.update(mockStudent);

      expect(component.updateComponent.open).toHaveBeenCalledWith(mockStudent);
    });
  });
});
