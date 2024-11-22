import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { ImageModule } from 'primeng/image';
import { AngularRemixIconComponent } from 'angular-remix-icon';

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
    PasswordModule,
    InputTextareaModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    ChipsModule,
    TagModule,
    StepsModule,
    ToastModule,
    TabMenuModule,
    ImageModule,
    NgOptimizedImage,
    AngularRemixIconComponent,
  ],
  templateUrl: './styling-showcase-secret-page.component.html',
  providers: [MessageService],
})
export class StylingShowcaseSecretPageComponent implements OnInit {
  constructor(public messageService: MessageService) {}
  sliderValue: number = 50; // Slider binding example
  value: string | undefined;

  passwordValue: string = '';
  passwordVisible: boolean = false;

  ingredient!: string; //values for radio buttons

  values: string[] | undefined; //values for chips
  max = 4; //max for chips

  rangeValues: number[] = [20, 80]; //range Slider

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  selectedCategory: any = null;

  // for radio button with only one option
  categories: any[] = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
    { name: 'Production', key: 'P' },
    { name: 'Research', key: 'R' },
  ];

  stepsMenuItems: MenuItem[] | undefined;
  tabMenuItems: MenuItem[] | undefined;

  activeIndex: number = 0;

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  ngOnInit() {
    this.selectedCategory = this.categories[1];
    this.stepsMenuItems = [
      {
        label: 'Personal',
        command: (event: any) =>
          this.messageService.add({
            severity: 'info',
            summary: 'First Step',
            detail: event.item.label,
          }),
      },
      {
        label: 'Seat',
        command: (event: any) =>
          this.messageService.add({
            severity: 'info',
            summary: 'Second Step',
            detail: event.item.label,
          }),
      },
      {
        label: 'Payment',
        command: (event: any) =>
          this.messageService.add({
            severity: 'info',
            summary: 'Third Step',
            detail: event.item.label,
          }),
      },
      {
        label: 'Confirmation',
        command: (event: any) =>
          this.messageService.add({
            severity: 'info',
            summary: 'Last Step',
            detail: event.item.label,
          }),
      },
    ];

    this.tabMenuItems = [
      { label: 'Dashboard', icon: 'ri-home-2-line' },
      { label: 'Transactions', icon: 'ri-qr-scan-2-line' },
      { label: 'Products', icon: 'ri-edit-box-line' },
      { label: 'Messages', icon: 'pi pi-inbox' },
    ];
  }
}
