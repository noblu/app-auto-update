import { app} from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });


  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  updateElectronApp({
    updateSource: {
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: 'https://github.com/noblu/app-auto-test'
    },
    updateInterval: '1 minute',
    logger: require('electron-log')
  })
})();

app.on('window-all-closed', () => {
  app.quit();
});
