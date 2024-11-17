import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterPageComponent } from './register-page.component';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterPageComponent,
        HttpClientTestingModule, // Für HttpClient
        RouterTestingModule, // Für Router und RouterLink
      ],
      providers: [
        MessageService, // Für MessageService
        {
          provide: ActivatedRoute, // Mock für ActivatedRoute
          useValue: {
            params: of({}), // Mock-Parameter (leere Parameter)
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
