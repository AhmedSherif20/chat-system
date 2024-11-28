import { inject, Injectable } from '@angular/core';
import { User } from '../../interfaces/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { SecureLSService } from '../secureLS/secure-ls.service';

/**
 * Service to manage user authentication state, including handling user data storage,
 * login status, and logout functionality. The service interacts with both localStorage
 * (via a secure storage service) and sessionStorage for storing user data based on the
 * "Remember Me" feature.
 *
 * This service provides methods for:
 * - Storing and retrieving user data securely.
 * - Checking whether the user is logged in and if their session is still valid.
 * - Logging the user out and clearing stored data.
 */
@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private secureLSService: SecureLSService = inject(SecureLSService);

  /**
   * A private BehaviorSubject to hold the current user data.
   * It emits the user data or null if not logged in.
   */
  private userDataSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  /**
   * Observable stream that other components can subscribe to in order
   * to receive updates on the current user data.
   */
  userData$: Observable<User | null> = this.userDataSubject.asObservable();

  constructor() {
    // Ensure the user data is fetched on service initialization
    this.loadUserFromStorage();
  }

  /**
   * Method to load the user data from storage (localStorage or sessionStorage)
   */
  loadUserFromStorage(): void {
    const savedUser = this.getUserFromStorage();
    if (savedUser) {
      // If a user is found in storage, set it in the BehaviorSubject
      this.userDataSubject.next(savedUser);
    }
  }

  /**
   * Set the user data after login or registration and store it.
   * This method also handles storing the data in localStorage or sessionStorage
   * based on the "rememberMe" flag.
   *
   * @param user - The user object containing the user's data.
   * @param rememberMe - Boolean flag indicating if the user wants to be remembered.
   */
  setUser(user: User, rememberMe: boolean): void {
    this.userDataSubject.next(user);
    this.saveUserToStorage(user, rememberMe); // Save the user data to localStorage or sessionStorage
  }

  /**
   * Check if the user is logged in by verifying the presence of valid user data
   * and if the token's expiration date is valid.
   *
   * @returns A boolean indicating if the user is logged in and their token is valid.
   */
  isLoggedIn(): boolean {
    const user = this.userDataSubject.getValue();
    return user !== null && new Date(user.validTO) > new Date(); // Check if token is still valid
  }

  /**
   * Logs the user out by clearing the user data from both the BehaviorSubject
   * and from localStorage/sessionStorage.
   */
  logout(): void {
    this.userDataSubject.next(null);
    this.clearUserStorage(); // Clear storage on logout
  }

  /**
   * Save user data to storage (either localStorage or sessionStorage) based on the
   * "rememberMe" flag. If `rememberMe` is true, the data is encrypted and saved to
   * localStorage using a secure service.
   *
   * @param user - The user object to be saved.
   * @param rememberMe - Boolean flag indicating if the user wants to be remembered.
   */
  private saveUserToStorage(user: User, rememberMe: boolean): void {
    if (rememberMe) {
      this.secureLSService.encryptData('user', user); // Encrypt data and store in localStorage
    } else {
      sessionStorage.setItem('user', JSON.stringify(user)); // Store in sessionStorage if not remembered
    }
  }

  /**
   * Retrieves the user data from storage (localStorage or sessionStorage).
   * The method first attempts to decrypt data from localStorage (if encrypted),
   * then falls back to sessionStorage if no encrypted data is found.
   *
   * @returns The user object if found in storage, or null if no data exists.
   */
  getUserFromStorage(): User | null {
    const userData =
      this.secureLSService.decryptData('user') ||
      sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clears the user data from both localStorage and sessionStorage.
   * This method is invoked when the user logs out.
   */
  private clearUserStorage(): void {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
}
