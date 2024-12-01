/**
 * Component for handling video call functionality.
 * Manages peer-to-peer connections, video and audio streams, and SignalR communication for real-time signaling.
 */
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SignalRService } from '../../services/signal-r/signal-r.service';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../../../services/sweet alert/sweet-alert.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.scss',
})
export class VideoCallComponent implements OnInit, OnDestroy {
  /** SignalR service for managing real-time signaling for video calls. */
  private signalRService: SignalRService = inject(SignalRService);

  /** Service for displaying alerts and notifications during video calls. */
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);

  /** Reference to the local video element for displaying the user's video stream. */
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  /** Reference to the remote video element for displaying the remote user's video stream. */
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  /**
   * The ID of the receiver (the user on the other end of the call).
   */
  @Input() receiverId: string = ``;

  /** Peer-to-peer connection for managing WebRTC interactions. */
  private peerConnection!: RTCPeerConnection;

  /** Media stream for the local user's video and audio. */
  private localStream!: MediaStream;

  /** Subscription object for managing SignalR event subscriptions. */
  private subs: Subscription = new Subscription();

  /** Indicates whether a video call has started. */
  isStartVideoCall: boolean = false;

  /**
   * Lifecycle hook that is triggered when the component is initialized.
   * Sets up SignalR listeners and subscribes to received signals.
   */
  ngOnInit(): void {
    this.signalRService.listenForSignals();
    this.subs.add(
      this.signalRService.receivedSignal$.subscribe((signal) => {
        if (signal) {
          this.handleSignal(signal);
        }
      })
    );
  }

  /**
   * Checks whether video chat can be started.
   * Video chat is only allowed at specific times (3:00 AM and 3:00 PM).
   *
   * @returns `true` if video chat is allowed, otherwise `false`.
   */
  canStartVideoChat(): boolean {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    // return hours === 3 || hours === 15;
    return true;
  }

  /**
   * Starts the video chat by initializing local media streams and setting up WebRTC peer connections.
   * Sends the SDP offer to the receiver via SignalR.
   */
  async startVideoChat(): Promise<void> {
    if (!this.canStartVideoChat()) {
      this.sweetAlertService.showAlert({
        icon: 'info',
        title: 'Video call is only available at 03:00 AM and 03:00 PM.',
      });
      return;
    }

    this.isStartVideoCall = true;

    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.sweetAlertService.showAlert({
        icon: 'warning',
        title: 'Your browser does not support video call functionality.',
      });
      return;
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.localVideo.nativeElement.srcObject = this.localStream;

      this.peerConnection = new RTCPeerConnection();
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      this.peerConnection.ontrack = (event) => {
        this.remoteVideo.nativeElement.srcObject = event.streams[0];
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.signalRService.sendSignal(
            this.receiverId,
            JSON.stringify(event.candidate)
          );
        }
      };

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.signalRService.sendSignal(this.receiverId, JSON.stringify(offer));
    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.sweetAlertService.showAlert({
        icon: 'error',
        title: 'Unable to access your camera or microphone.',
      });
    }
  }

  /**
   * Handles incoming signaling data from SignalR.
   * Processes SDP offers/answers and ICE candidates.
   *
   * @param signal The signaling data received from the server.
   */
  async handleSignal(signal: string): Promise<void> {
    const parsedSignal = JSON.parse(signal);

    if (parsedSignal.type === 'callEnded') {
      this.closeVideoChat();
    }

    if (parsedSignal.sdp) {
      await this.peerConnection.setRemoteDescription(parsedSignal);
      if (parsedSignal.type === 'offer') {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.signalRService.sendSignal(
          'ReceiverIdHere',
          JSON.stringify(answer)
        );
      }
    } else if (parsedSignal.candidate) {
      await this.peerConnection.addIceCandidate(parsedSignal);
    }
  }

  /**
   * Ends the video call by stopping media streams, closing the peer connection, and resetting the UI.
   * Displays a toast notification to indicate the call has ended.
   */
  closeVideoChat(): void {
    // Stop all tracks in the local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null!;
    }

    // Close the peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null!;
    }

    // Reset video elements
    if (this.localVideo) {
      this.localVideo.nativeElement.srcObject = null;
    }
    if (this.remoteVideo) {
      this.remoteVideo.nativeElement.srcObject = null;
    }

    this.isStartVideoCall = false;

    this.sweetAlertService.showToast({
      icon: 'success',
      title: 'The Call has ended.',
    });
  }

  /**
   * Lifecycle hook that is triggered when the component is destroyed.
   * Unsubscribes from SignalR subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
