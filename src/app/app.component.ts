import { Component, inject, OnInit } from '@angular/core';
import { UserStateService } from './services/user state/user-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private userStateService: UserStateService = inject(UserStateService);
  title = 'Chatting-System';

  ngOnInit(): void {
    this.userStateService.loadUserFromStorage();
  }
}
