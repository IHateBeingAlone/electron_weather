// @ts-ignore
import {IWizardDefinition} from './IWizardDefinition'

const entryPoints: { [x: string]: IWizardDefinition } = {
  main: {},
  addWizard: {
    width: 500,
    height: 400,
    title: 'Добавление города'
  }
}

export { entryPoints }
