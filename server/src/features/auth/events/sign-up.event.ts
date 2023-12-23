export class SignUpEvent {
  event: { email: string };

  constructor(event: { email: string }) {
    this.event = event;
  }
}
