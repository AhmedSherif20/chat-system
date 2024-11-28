import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor() {}

  /**
   * Display a toast notification.
   * @param options Options for the toast notification.
   */
  showToast(options: SweetAlertOptions): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      ...options,
    });
  }

  /**
   * Display a normal alert.
   * @param options Options for the alert.
   */
  showAlert(options: SweetAlertOptions): void {
    Swal.fire({
      timerProgressBar: true,
      timer: 3000,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      customClass: {
        confirmButton: 'bg-main',
      },
      ...options,
    });
  }

  /**
   * Display a confirmation alert with Yes and No buttons.
   * @param options Options for the confirmation alert.
   * @returns A promise resolved with the SweetAlertResult.
   */
  async showConfirmationAlert(
    options: SweetAlertOptions
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      showCancelButton: true,
      ...options,
    });
  }

  /**
   * Display a dialog with three buttons.
   * @param options Options for the dialog.
   * @returns A promise resolved with the SweetAlertResult.
   */
  async showThreeButtonsDialog(
    options: SweetAlertOptions
  ): Promise<SweetAlertResult> {
    return await Swal.fire({
      showDenyButton: true,
      showCancelButton: true,
      ...options,
    });
  }

  /**
   * Display a confirm dialog with an action attached to the Confirm button.
   * @param options Options for the confirm dialog.
   * @param onConfirm The action to perform on confirmation.
   * @returns A promise resolved with the SweetAlertResult.
   */
  async showConfirmDialogWithAction(
    options: SweetAlertOptions,
    onConfirm: () => void
  ): Promise<SweetAlertResult> {
    const result = await Swal.fire({
      showCancelButton: true,

      customClass: {
        confirmButton: 'bg-main',
      },
      ...options,
    });

    if (result.isConfirmed) {
      onConfirm();
    }

    return result;
  }

  /**
   * Display an input dialog and perform an action with the input value.
   * @param options Options for the input dialog.
   * @param onInput The action to perform with the input value.
   * @returns A promise resolved with the SweetAlertResult.
   */
  async showInputDialog(
    options: SweetAlertOptions,
    onInput: (inputValue: string) => void
  ): Promise<SweetAlertResult> {
    const result = await Swal.fire({
      input: 'text',
      showCancelButton: true,
      ...options,
    });

    if (result.isConfirmed && result.value) {
      onInput(result.value);
    }

    return result;
  }
}
