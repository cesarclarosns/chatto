export class PaymentsService {
  private readonly paymentModel: any

  constructor() {}

  async findOne(id: string) {
    console.log(id)
  }

  async createMessagePayment() {}

  async createPostPayment() {}

  async createUserSubscriptionPayment() {}

  async createPlatformSubscriptionPayment() {}
}

export const paymentsService = new PaymentsService()
