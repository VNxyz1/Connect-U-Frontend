import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylingShowcaseSecretPageComponent } from './styling-showcase-secret-page.component';

describe('StylingShowcaseSecretPageComponent', () => {
  let component: StylingShowcaseSecretPageComponent;
  let fixture: ComponentFixture<StylingShowcaseSecretPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylingShowcaseSecretPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StylingShowcaseSecretPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
