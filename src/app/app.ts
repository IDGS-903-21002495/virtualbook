import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public throwTestError(): void {
    throw new Error('This is a test error for Sentry!');
  }
  
  protected title = 'virtualbook';
}
