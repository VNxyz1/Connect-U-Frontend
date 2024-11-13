import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavbarComponent], // NavbarComponent hier importiert und nicht deklariert
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should update currentUrl on NavigationEnd', () => {
    const mockEvent = new NavigationEnd(1, '/test-path', '/test-path');
    spyOn(router.events, 'pipe').and.returnValue(of(mockEvent));

    component.ngOnInit();

    expect(component.currentUrl).toBe('/test-path');
  });

  it('should return "secondary" severity if the path matches currentUrl', () => {
    component.currentUrl = '/test-path';
    expect(component.getSeverity('/test-path')).toBe('secondary');
  });

  it('should return "primary" severity if the path does not match currentUrl', () => {
    component.currentUrl = '/different-path';
    expect(component.getSeverity('/test-path')).toBe('primary');
  });

  it('should navigate to the specified path', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateTo('/new-path');
    expect(navigateSpy).toHaveBeenCalledWith(['/new-path']);
  });

  it('should return filled icon name if the path matches currentUrl', () => {
    component.currentUrl = '/search';
    expect(component.activeIcon('/search')).toBe('search-fill');
  });

  it('should return line icon name if the path does not match currentUrl', () => {
    component.currentUrl = '/home';
    expect(component.activeIcon('/search')).toBe('search-line');
  });

});
