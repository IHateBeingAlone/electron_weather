import { ipcRenderer } from 'electron'
import { IWizardResponse, isWizardResponse } from '../interfaces/wizard'
import { randomUUID } from 'crypto'

const BackgroundServiceCalls = {
  CompleteWizard(response: IWizardResponse): void {
    const myself = new URLSearchParams(window.location.search)
    ipcRenderer.send(`wizard-complete`, response, myself.get('launchid'))
  },

  LaunchWizard(wizardId: string, data?: unknown): Promise<IWizardResponse> {
    const launchId = randomUUID()
    ipcRenderer.send('wizard-request', { launchId, wizardId, data })

    return new Promise<IWizardResponse>((resolve, reject) => {
      ipcRenderer.once(`wizard-reply`, (_, data: IWizardResponse | unknown, incomingLaunchId) => {
        if (launchId != incomingLaunchId) return
        if (!isWizardResponse(data)) return
        if (data.success) {
          resolve(data)
        } else {
          reject(data)
        }
      })
    })
  }
}

export { BackgroundServiceCalls }
