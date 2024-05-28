import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { Student, StudentService } from '../../service/student.service';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    WindowModule,
    ButtonsModule,
    InputsModule,
    ReactiveFormsModule,
    DateInputsModule,
    CommonModule,
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent implements OnInit {
  @Output('update')
  private updateUser: EventEmitter<Student> = new EventEmitter();

  public form!: FormGroup;
  public opened = false;
  private studentId: string | null = null;

  constructor(private service: StudentService) {}

  public ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birthDate: new FormControl(null, [Validators.required]),
    });
  }

  public close(): void {
    this.opened = false;
  }

  public open(student: Student): void {
    this.form.patchValue({
      name: student.name,
      email: student.email,
      birthDate: new Date(student.birthDate),
    });
    this.studentId = student.id;
    this.opened = true;
  }

  public disabledDates = (date: Date): boolean => {
    return date && date.getTime() > new Date().getTime();
  };

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const student: Student = {
      id: this.studentId,
      ...this.form.value,
    };
    const subscription = this.service.updateStudent(student).subscribe({
      next: (data) => {
        if (data.data?.updateStudent) {
          this.updateUser.next(data.data?.updateStudent);
        }
        subscription.unsubscribe();
        this.close();
      },
      error: (error) => {
        subscription.unsubscribe();
        this.opened = false;
      },
    });
  }
}
