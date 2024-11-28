import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * @description
 * `InputComponent` is a reusable Angular component for handling various types of input fields, including text, password, email, and number types.
 * It supports validation and custom error messages for common input validation scenarios like required, email, pattern, and minlength.
 *
 * @example
 * <app-input
 *    [label]="'Username'"
 *    [control]="usernameFormControl"
 *    [required]="true"
 *    [type]="'text'"
 *    [placeholder]="'Enter your username'"
 *    [minLength]="5"
 *    [patternValidator]="true"
 *    [pattern]="'^[a-zA-Z0-9_]+$'"
 *    [patternMsg]="'Username must be alphanumeric'">
 * </app-input>
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  /**
   * The label for the input field, which will be used as the placeholder and for error messages.
   * @default ''
   */
  @Input() label: string = '';

  /**
   * The FormControl instance to bind the input field to form control.
   */
  @Input() control: FormControl | any;

  /**
   * The type of the input field (e.g., text, password, email).
   * @default 'text'
   */
  @Input() type: string = 'text';

  /**
   * Placeholder text for the input field.
   * @default ''
   */
  @Input() placeholder: string = '';

  /**
   * Whether the input field is required.
   * If true, a required validation error will be shown.
   * @default false
   */
  @Input() required: boolean = false;

  /**
   * Whether to apply pattern validation to the input field.
   * @default false
   */
  @Input() patternValidator: boolean = false;

  /**
   * The pattern (RegEx) to validate the input field against.
   */
  @Input() pattern: string | RegExp = '';

  /**
   * The minimum length for the input value.
   * @default -1 (no minimum length)
   */
  @Input() minLength: number = -1;

  /**
   * The input mode to be used (e.g., text, numeric).
   * @default 'text'
   */
  @Input() inputMode: string = 'text';

  /**
   * The minimum value allowed for number input.
   */
  @Input() minValue: number | null = null;

  /**
   * The maximum value allowed for number input.
   */
  @Input() maxValue: number | null = null;

  /**
   * Unique ID for the input element. Automatically generated if not specified.
   */
  inputId: string = `input-${Math.random().toString(36).substring(2, 15)}`;

  /**
   * Flag to check if the input type is password.
   */
  isPasswordField: boolean = false;

  /**
   * Flag to toggle password visibility.
   */
  showPassword: boolean = false;

  /**
   * Custom message for pattern validation error.
   * If provided, it will be displayed when the input doesn't match the pattern.
   */
  @Input() patternMsg: string = '';

  /**
   * Lifecycle hook: Initialize the component and determine if the input is a password field.
   */
  ngOnInit(): void {
    this.handlePasswordInput();
  }

  /**
   * Lifecycle hook: Trigger change detection to ensure any changes are reflected in the view.
   */
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  /**
   * Checks if the specified form control has a specific validation error.
   *
   * @param control The form control to check for errors.
   * @param validator The type of validation error to check for (e.g., 'required', 'email', 'pattern', 'minlength').
   * @returns true if the form control has the specified error and has been touched.
   */
  checkFormControlError(
    control: FormControl,
    validator: 'required' | 'email' | 'pattern' | 'minlength'
  ): boolean {
    return (control.touched && control.hasError(validator)) ?? true;
  }

  /**
   * Determines if the input field is of type password and sets the `isPasswordField` flag accordingly.
   */
  handlePasswordInput(): void {
    this.isPasswordField = this.type === 'password' ? true : false;
  }

  /**
   * Toggles the visibility of the password in the input field.
   * Changes the input type between 'text' and 'password'.
   */
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}
