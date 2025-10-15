import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { App } from './app';

@Component({
  selector: 'app-header',
  template: '',
  standalone: true,
})
class MockHeaderComponent {}

@Component({
  selector: 'app-product-list',
  template: '',
  standalone: true,
})
class MockProductListComponent {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
    .overrideComponent(App, {
      set: {
        imports: [MockHeaderComponent, MockProductListComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header component', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should render the product list component', () => {
    const productListElement = fixture.debugElement.query(By.css('app-product-list'));
    expect(productListElement).toBeTruthy();
  });

  it('should have a main content area', () => {
    const mainElement = fixture.debugElement.query(By.css('main.content'));
    expect(mainElement).toBeTruthy();
  });
});