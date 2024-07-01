import MainWindow from './components/MainWindow'
import AddWizard from './wizards/AddWizard'

const entryPoints = {
  main: <MainWindow></MainWindow>,
  addWizard: <AddWizard></AddWizard>,
}

function Fallback(): JSX.Element {
  return <>Пизда мотору</>
}

function App(): JSX.Element {
  const route = new URLSearchParams(window.location.search).get('wizard')

  let elementToRender = <Fallback></Fallback>

  if (route && entryPoints[route]) {
    elementToRender = entryPoints[route]
  }

  return elementToRender
}

export default App
