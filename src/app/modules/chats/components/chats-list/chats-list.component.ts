import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthApiService } from '../../../auth/services/Auth API/auth-api.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { SweetAlertService } from '../../../../services/sweet alert/sweet-alert.service';
import { UserStateService } from '../../../../services/user state/user-state.service';

interface ShortUserInfo {
  id: string;
  userName: string;
}

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  private authApiService: AuthApiService = inject(AuthApiService);
  private userStateService: UserStateService = inject(UserStateService);
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);

  @Output() HideChatsList: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  loading: boolean = false;

  allUsers: ShortUserInfo[] = [];
  displayedUsers: ShortUserInfo[] = [];

  currentUserId: Observable<string> = this.userStateService.userData$.pipe(
    map((user) => user?.id ?? '')
  );

  searchTerm: string = '';

  selectedUserId: string = ``;

  @Output() selectedUser: EventEmitter<ShortUserInfo> = new EventEmitter();

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers(): Promise<void> {
    this.loading = true;

    const apiResponse = await firstValueFrom(this.authApiService.getAllUsers());

    const { data, isSuccess } = apiResponse;

    this.allUsers = data;
    this.displayedUsers = this.allUsers;

    if (!isSuccess) {
      this.sweetAlertService.showAlert({
        icon: 'error',
        title: 'unexpected Error happen',
        text: 'please try again later',
      });

      this.loading = false;
      return;
    }

    this.loading = false;
  }

  filterUsers(): void {
    const searchLower = this.searchTerm.toLowerCase();
    this.displayedUsers = this.allUsers.filter((user) =>
      user.userName.toLowerCase().includes(searchLower)
    );
  }

  selectUser(user: ShortUserInfo): void {
    console.log(user);
    this.selectedUserId = user.id;
    this.selectedUser.emit(user);
    this.hideChats();
  }

  hideChats() {
    this.HideChatsList.emit(false);
  }
}
