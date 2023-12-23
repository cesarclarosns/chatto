export class ResetPasswordEvent {
  event: { email: string; resetPasswordLink: string };

  constructor(event: { email: string; resetPasswordLink: string }) {
    this.event = event;
  }
}
