import { TestBed } from '@angular/core/testing';
import { StylingShowcaseSecretPageComponent } from './styling-showcase-secret-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
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
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { ImageModule } from 'primeng/image';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('StylingShowcaseSecretPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        AngularRemixIconComponent,
        StylingShowcaseSecretPageComponent,
      ],
      providers: [
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Mock any route params if needed
            snapshot: { paramMap: new Map() }, // Mock any snapshot data if needed
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(StylingShowcaseSecretPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
