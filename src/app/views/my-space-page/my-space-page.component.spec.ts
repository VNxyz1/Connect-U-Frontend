import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySpacePageComponent } from './my-space-page.component';

describe('MySpacePageComponent', () => {
  let component: MySpacePageComponent;
  let fixture: ComponentFixture<MySpacePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySpacePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySpacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
