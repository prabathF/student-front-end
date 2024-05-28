import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, MutationResult, QueryRef, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

export interface Student {
  id: string;
  name: string;
  email: string;
  birthDate: Date;
  age?: number;
}

export interface studentData {
  students: students;
}

export interface students {
  totalCount: number;
  students: Student[];
}

export interface DeletedStudent {
  deleteStudent: Student;
}

export interface UpdateStudent {
  updateStudent: Student;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  students(
    take: number,
    skip: number
  ): Observable<MutationResult<studentData>> {
    return this.apollo.query<studentData>({
      query: gql`
        query students($studentArgs: StudentArgs!) {
          students(studentArgs: $studentArgs) {
            totalCount
            students {
              id
              name
              email
              birthDate
              age
            }
          }
        }
      `,
      variables: {
        studentArgs: { take, skip },
      },
    });
  }

  deleteStudent(id: string): Observable<MutationResult<DeletedStudent>> {
    return this.apollo.mutate<DeletedStudent>({
      mutation: gql`
        mutation deleteStudent($id: Float!) {
          deleteStudent(id: $id) {
            id
            name
            email
            birthDate
            age
          }
        }
      `,
      variables: {
        id: Number(id),
      },
    });
  }

  updateStudent(student: Student): Observable<MutationResult<UpdateStudent>> {
    return this.apollo.mutate<UpdateStudent>({
      mutation: gql`
        mutation updateStudent($studentUpdateArgs: StudentUpdateArgs!) {
          updateStudent(studentUpdateArgs: $studentUpdateArgs) {
            id
            name
            email
            birthDate
            age
          }
        }
      `,
      variables: {
        studentUpdateArgs: {
          ...student,
          id: Number(student.id),
        },
      },
    });
  }

  uploadFile(file: File): Observable<any> {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);

    // Perform the HTTP request
    return this.http.post('http://localhost:3002/student/file', formData);
  }
}
