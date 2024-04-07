import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {Subject} from "../interface/subject.interface";
import {SubjectApiService} from "../services/subject-api.service";

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent{

  public subject$ : Observable<Subject[]> = this.listSubject();
  constructor(
    private subjectApiService: SubjectApiService
  ) { }

  private listSubject() : Observable<Subject[]> {
    return this.subject$ = this.subjectApiService.allSubject();
  }
}
