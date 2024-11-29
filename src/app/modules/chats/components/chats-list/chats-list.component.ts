/**
 * Component responsible for displaying and managing the list of available chats.
 * Provides functionality to filter, select, and emit selected user events.
 */
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthApiService } from '../../../auth/services/Auth API/auth-api.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { SweetAlertService } from '../../../../services/sweet alert/sweet-alert.service';
import { UserStateService } from '../../../../services/user state/user-state.service';

/** Interface representing a user's brief information. */
interface ShortUserInfo {
  /** Unique identifier for the user. */
  id: string;
  /** Username of the user. */
  userName: string;
}

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  /** Service for user authentication-related API operations. */
  private authApiService: AuthApiService = inject(AuthApiService);

  /** Service for managing and retrieving the current user state. */
  private userStateService: UserStateService = inject(UserStateService);

  /** Service for displaying alerts and notifications. */
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);

  /**
   * Event emitted when the chat list visibility should change.
   * Emits a boolean value indicating the visibility state.
   */
  @Output() HideChatsList: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /** Flag indicating whether the user list is being loaded. */
  loading: boolean = false;

  /** List of all users retrieved from the API. */
  allUsers: ShortUserInfo[] = [];

  /** List of users filtered based on the search term. */
  displayedUsers: ShortUserInfo[] = [];

  /** Observable containing the current user's ID. */
  currentUserId: Observable<string> = this.userStateService.userData$.pipe(
    map((user) => user?.id ?? '')
  );

  /** The search term used to filter the user list. */
  searchTerm: string = '';

  /** The ID of the currently selected user. */
  selectedUserId: string = ``;

  /**
   * Event emitted when a user is selected from the list.
   * Emits the selected user's information.
   */
  @Output() selectedUser: EventEmitter<ShortUserInfo> = new EventEmitter();

  /**
   * Lifecycle hook that initializes the component.
   * Retrieves the list of users from the API.
   */
  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * Fetches the list of all users from the API and stores them locally.
   * Displays an error alert if the request fails.
   *
   * @returns A promise that resolves when the user data is retrieved.
   */
  async getUsers(): Promise<void> {
    this.loading = true;

    const apiResponse = await firstValueFrom(this.authApiService.getAllUsers());
    const { data, isSuccess } = apiResponse;

    this.allUsers = data;
    this.displayedUsers = this.allUsers;

    if (!isSuccess) {
      this.sweetAlertService.showAlert({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'Please try again later.',
      });

      this.loading = false;
      return;
    }

    this.loading = false;
  }

  /**
   * Filters the user list based on the search term.
   * Updates the `displayedUsers` array with matching users.
   */
  filterUsers(): void {
    const searchLower = this.searchTerm.toLowerCase();
    this.displayedUsers = this.allUsers.filter((user) =>
      user.userName.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Selects a user from the list and emits the selected user event.
   * Also hides the chat list.
   *
   * @param user The selected user's information.
   */
  selectUser(user: ShortUserInfo): void {
    console.log(user);
    this.selectedUserId = user.id;
    this.selectedUser.emit(user);
    this.hideChats();
  }

  /**
   * Emits an event to hide the chat list.
   */
  hideChats(): void {
    this.HideChatsList.emit(false);
  }
}
