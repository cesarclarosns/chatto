import { UserRegisteredEvent } from '@features/users/events/user-registered.event'
import { UserResetPasswordEvent } from '@features/users/events/user-reset-password.event'

const USERS_EVENTS: {
  userRegistered: 'user.registered'
  userResetPassword: 'user.resetPassword'
} = {
  userRegistered: 'user.registered',
  userResetPassword: 'user.resetPassword',
}

export { UserRegisteredEvent, UserResetPasswordEvent, USERS_EVENTS }
