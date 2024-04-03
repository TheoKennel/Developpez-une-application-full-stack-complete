import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

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

