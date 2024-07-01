import { BrowserWindow, WebContents, app, ipcMain, shell, Notification } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { IWizardRequest, IWizardResponse, isWizardRequest } from '../interfaces/wizard'
import { entryPoints } from '../definitions/index'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Install react devtools
  // installExtension
  //   //@ts-ignore library sucks ass
  //   .default('fmkadmapgofadopljbjfkapdkoienihi')
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err))

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  function createWizardWindow(wizardId: string, launchId?: string): BrowserWindow {
    console.log('Creating a window')

    const requestedWizard = entryPoints[wizardId]

    const wizardWindow = new BrowserWindow({
      width: requestedWizard.width ?? 900,
      height: requestedWizard.height ?? 670,
      show: false,
      resizable: true,
      title: 'Кроссовок init',
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: true
      }
    })
    wizardWindow.on('ready-to-show', () => {
      console.log('Showing')
      wizardWindow.show()
    })

    wizardWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.

    const params = new URLSearchParams()
    params.set('wizard', wizardId)
    if (launchId) {
      params.set('launchid', launchId)
    }
    if (process.env['ELECTRON_RENDERER_URL']) {
      wizardWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '?' + params.toString())
      wizardWindow.setTitle('main hmr')
    } else {
      const urlToLoad = `file://${__dirname}/../renderer/index.html?${params.toString()}`
      console.log('Standalone mode, loading url', urlToLoad)
      wizardWindow.loadURL(urlToLoad)
      wizardWindow.setTitle('main direct')
    }

    if (launchId) {
      wizardWindow.setTitle(`${requestedWizard.title ?? 'EFCross'} (${wizardId} ${launchId}) `)
    }

    return wizardWindow
  }

  const host = createWizardWindow('main')
  host.on('close', () => app.quit())
  const requesterWindows = new Map<string, WebContents>()

  ipcMain.on('wizard-request', (evt, data: IWizardRequest | unknown) => {
    if (!isWizardRequest(data)) return
    console.log('Somebody asked for a wizard!')

    const w = createWizardWindow(data.wizardId, data.launchId)
    w.on('ready-to-show', () => {
      w.webContents.send('wizard-data', data.data)
    })

    requesterWindows.set(data.launchId, evt.sender)
  })

  ipcMain.on('wizard-complete', (evt, data: IWizardResponse, launchId: string) => {
    console.log('Wizard done')
    const requester = requesterWindows.get(launchId)
    if (requester) {
      console.log(`Letting window [${requester.getTitle()}] know`)
      requester.send('wizard-reply', data, launchId)
      evt.sender.close()
    } else {
      console.error(`No sender by id ${launchId}`)
    }
  })

  ipcMain.on('notification', (_, data: {title: string, body?: string}) => {
    new Notification({
      title: data.title,
      body: data.body
    }).show()
  })

  return createWizardWindow
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
