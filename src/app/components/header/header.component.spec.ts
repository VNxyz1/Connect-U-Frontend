import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { NgOptimizedImage } from '@angular/common';
import { ImageModule } from 'primeng/image';
import {
  AngularRemixIconComponent,
  provideRemixIcon,
} from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { provideRouter } from '@angular/router';

import {
  RiAddLine,
  RiArrowLeftSLine,
  RiBookmarkLine,
  RiCheckLine,
  RiFunctionFill,
  RiFunctionLine,
  RiHeart3Line,
  RiHome2Fill,
  RiHome2Line,
  RiLayoutGridFill,
  RiSearchFill,
  RiSearchLine,
  RiUser3Fill,
  RiUser3Line,
} from 'angular-remix-icon';
import { routes } from '../../app.routes';

// Erstellen Sie eine Icons-Objekt-Konfiguration ähnlich wie in der App-Konfiguration.
const icons = {
  RiHome2Line,
  RiCheckLine,
  RiBookmarkLine,
  RiSearchLine,
  RiUser3Line,
  RiHeart3Line,
  RiAddLine,
  RiLayoutGridFill,
  RiHome2Fill,
  RiFunctionLine,
  RiUser3Fill,
  RiFunctionFill,
  RiSearchFill,
  RiArrowLeftSLine,
};

// Mock für NavigationEnd Event
class MockRouter {
  public events = of(new NavigationEnd(0, '/my-space', '/my-space'));
  navigate() {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgOptimizedImage,
        ImageModule,
        AngularRemixIconComponent,
        Button,
        HeaderComponent,
      ],
      providers: [
        provideRouter(routes), // Bereitstellung des Routers
        provideRemixIcon(icons), // Bereitstellung der Remix-Icons
        { provide: Router, useClass: MockRouter }, // Mock des Routers für Tests
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentUrl on NavigationEnd', () => {
    component.ngOnInit();
    expect(component.currentUrl).toBe('/my-space');
  });

  it('should navigate back to home when backToHome is called', () => {
    spyOn(router, 'navigate');
    component.backToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display correct title based on currentUrl', () => {
    component.currentUrl = '/my-space';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Mein Bereich');

    component.currentUrl = '/my-events';
    fixture.detectChanges();
    expect(compiled.querySelector('h1').textContent).toContain('Meine Events');
  });

  it('should display the logo when on the root URL', () => {
    component.currentUrl = '/';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p-image')).toBeTruthy();
    expect(compiled.querySelector('p-image').getAttribute('alt')).toBe(
      'Connect-U Logo',
    );
  });
});
