export interface IWizardResponse {
  success: boolean
  payload: string
}

export function isWizardResponse(data: unknown): data is IWizardResponse {
  if (
    typeof (data as IWizardResponse).success == 'boolean' &&
    typeof (data as IWizardResponse).payload == 'string'
  ) {
    return true
  } else {
    console.error('A malformed wizard response has been sent', data)
    return false
  }
}

export interface IWizardRequest {
  wizardId: string
  launchId: string
  data?: unknown
}

export function isWizardRequest(data: unknown): data is IWizardRequest {
  if (
    typeof (data as IWizardRequest).wizardId == 'string' &&
    typeof (data as IWizardRequest).launchId == 'string'
  ) {
    return true
  } else {
    console.error('A malformed wizard request has been sent', data)
    return false
  }
}
