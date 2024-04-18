import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

/**
 * Composant générique de formulaire utilisé pour recueillir des entrées utilisateur à travers divers champs.
 * Permet une réutilisation flexible dans différentes parties de l'application.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() title!: string;
  @Input() buttonText!: string;
  @Input() form!: FormGroup;
  @Input() errorMessage!: string | null;
  @Input() fields!: { name: string, label: string, type: string, placeholder: string; options?: any[] }[];
  @Output() submitForm = new EventEmitter<any>();
  @Output() navigate = new EventEmitter<void>();
}

