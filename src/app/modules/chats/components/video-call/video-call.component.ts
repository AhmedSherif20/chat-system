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
  private signalRService: SignalRService = inject(SignalRService);
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  @Input() receiverId: string = ``;

  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private subs: Subscription = new Subscription();
  isStartVideoCall: boolean = false;

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

  canStartVideoChat(): boolean {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    // return hours === 3 || hours === 15;
    return true;
  }

  async startVideoChat() {
    if (!this.canStartVideoChat()) {
      this.sweetAlertService.showAlert({
        icon: 'info',
        title: 'Video call is only available at 03:00 AM and 03:00 PM.',
      });
      return;
    }

    this.isStartVideoCall = true;

    // تحقق من دعم getUserMedia
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

  async handleSignal(signal: string) {
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

  closeVideoChat() {
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
