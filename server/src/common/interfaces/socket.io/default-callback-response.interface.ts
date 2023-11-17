export default interface IDefaultCallbackResponse {
  status: 'success' | 'failed'
  payload?: any
  message?: any
  errors?: any
}
