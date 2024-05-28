import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { StudentService } from '../../service/student.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UploadsModule,
    ReactiveFormsModule,
    LabelModule,
    InputsModule,
    ButtonsModule,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  public form!: FormGroup;
  public submitted = false;
  public restrictions: FileRestrictions = {
    allowedExtensions: ['csv'],
  };

  constructor(private studentService: StudentService) {}

  public ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(null, [Validators.required]),
    });
  }

  public save(valid: boolean): void {
    if (valid) {
      this.submitted = true;
      const subscription = this.studentService
        .uploadFile(this.form.controls['file']?.value[0])
        .subscribe({
          next: () => {
            this.form.reset();
            subscription.unsubscribe();
          },
          error: () => {
            this.form.markAllAsTouched();
            subscription.unsubscribe();
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
