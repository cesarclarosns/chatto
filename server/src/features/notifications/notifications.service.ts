export class NotificationsService {
  private readonly notificationModel: undefined

  constructor() {
    this.notificationModel = undefined
  }

  async findOne(id: string) {
    console.log(id)
  }

  async update() {}

  async findAll() {}

  async delete() {}
}

export const notificationsService = new NotificationsService()
