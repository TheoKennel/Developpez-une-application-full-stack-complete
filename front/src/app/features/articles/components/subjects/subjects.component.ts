import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {Subject as InterfaceSubject} from "../interface/subject.interface";
import {SubjectApiService} from "../services/subject-api.service";
import {BreakpointService} from "../../../../services/breakpoint-screen.service";

/**
 * Composant pour afficher la liste des sujets.
 */
@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit ,OnDestroy{

  public subject$: Observable<InterfaceSubject[]> = this.listSubject();
  public screenSize!: string;
  private ngUnsubscribe: any = new Subject();

  constructor(
    private subjectApiService: SubjectApiService,
    private breakpointService: BreakpointService
  ) {
  }

  ngOnInit() {
    this.responsiveBreakpoint();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private responsiveBreakpoint() {
    this.breakpointService.screenSize$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(screenSize => this.screenSize = screenSize);
  }

  /**
   * Récupère tous les sujets disponibles via le service SubjectApiService.
   * @returns Observable émettant un tableau de sujets.
   */
  private listSubject(): Observable<InterfaceSubject[]> {
    return this.subject$ = this.subjectApiService.allSubject();
  }
}

