export interface ISubscriptionPlan {
  _id: string
  price: number
  updatedAt: string
  subscriptionBundles: { duration: number; discount: number }[]
}
