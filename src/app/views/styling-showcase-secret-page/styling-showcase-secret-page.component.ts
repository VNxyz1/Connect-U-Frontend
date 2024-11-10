import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import {PasswordModule} from 'primeng/password';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-styling-showcase-secret-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    RadioButtonModule,
    ToggleButtonModule,
    SliderModule,
    TableModule,
    MessageModule,
    PasswordModule,
    InputTextareaModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    ChipsModule,
    TagModule,
    StepsModule,
  ],
  templateUrl: './styling-showcase-secret-page.component.html',
})
export class StylingShowcaseSecretPageComponent implements OnInit{
  sliderValue: number = 50; // Slider binding example
  value: string | undefined;

  passwordValue: string = '';
  passwordVisible: boolean = false;

  ingredient!: string; //values for radio buttons

  values: string[] | undefined; //values for chips
  max = 4; //max for chips

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  selectedCategory: any = null;

  // for radio button with only one option
  categories: any[] = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
    { name: 'Production', key: 'P' },
    { name: 'Research', key: 'R' }
  ];

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.selectedCategory = this.categories[1];
    this.items = [
      {
        label: 'Personal',
        routerLink: 'personal'
      },
      {
        label: 'Seat',
        routerLink: 'seat'
      },
      {
        label: 'Payment',
        routerLink: 'payment'
      },
      {
        label: 'Confirmation',
        routerLink: 'confirmation'
      }
    ];
  }

}
