import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StylingShowcaseSecretPageComponent } from './styling-showcase-secret-page.component';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('StylingShowcaseSecretPageComponent', () => {
  let component: StylingShowcaseSecretPageComponent;
  let fixture: ComponentFixture<StylingShowcaseSecretPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylingShowcaseSecretPageComponent],
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

    fixture = TestBed.createComponent(StylingShowcaseSecretPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
