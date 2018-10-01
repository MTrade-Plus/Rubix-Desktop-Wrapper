const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const app = electron.app;
const ipcMain = require('electron').ipcMain;

const path = require('path');
const url = require('url');

const EventType = {
	SHOW_MENU : 'SHOW_MENU'
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splashWin;

// ****************************************************************************
// Menu Related
// ****************************************************************************

let template = [{
    	label: 'Home',
    	submenu: [{
                label: 'Trading Console',
                accelerator: 'CmdOrCtrl+T',
                click: function (item, focusedWindow) {
                    // postMenuClickToRubix(item, focusedWindow);
                    showToBeImplementedMessage(focusedWindow);
                }
            }, {
            label: 'Dashboard',
            accelerator: 'CmdOrCtrl+D',
            click: function (item, focusedWindow) {
                // postMenuClickToRubix(item, focusedWindow);
                showToBeImplementedMessage(focusedWindow);
            }
        }, {
            label: 'Auto Trading',
            accelerator: 'CmdOrCtrl+A',
            click: function (item, focusedWindow) {
                // postMenuClickToRubix(item, focusedWindow);
                showToBeImplementedMessage(focusedWindow);
            }
        }, {
            label: 'Mubasher Store',
            accelerator: 'CmdOrCtrl+S',
            click: function (item, focusedWindow) {
                // postMenuClickToRubix(item, focusedWindow);
                showToBeImplementedMessage(focusedWindow);
            }
		}]
	}, {
		label: 'Trading Account',
    	submenu: [{
			label: 'Portfolio',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
				// postMenuClickToRubix(item, focusedWindow);
                showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Orders',
			accelerator: 'CmdOrCtrl+O',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Account Details',
			// accelerator: 'CmdOrCtrl+A',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Deposit & Withdrawals',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Focus List',
			// accelerator: 'CmdOrCtrl+T',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}]
	}, {
		label: 'Market',
		submenu: [{
			label: 'Market Overview',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
				// postMenuClickToRubix(item, focusedWindow);
                showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Watchlist',
			accelerator: 'CmdOrCtrl+O',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Global Markets',
			// accelerator: 'CmdOrCtrl+A',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'News & Announcements',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}]
	}, {
		label: 'Analytics',
		submenu: [{
			label: 'Top Stocks',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
				// postMenuClickToRubix(item, focusedWindow);
                showToBeImplementedMessage(focusedWindow);
			}
		}, {
            type: 'separator'
        }, {
			label: 'Chart',
			accelerator: 'CmdOrCtrl+C',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Stock Profile',
			// accelerator: 'CmdOrCtrl+A',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
            type: 'separator'
        }, {
			label: 'Screener',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Research',
			// accelerator: 'CmdOrCtrl+T',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}]
	}, {
		label: 'Services',
		submenu: [{
			label: 'My Alerts',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}, {
			label: 'Settings',
			// accelerator: 'CmdOrCtrl+T',
			click: function (item, focusedWindow) {
				showToBeImplementedMessage(focusedWindow);
			}
		}]
	}, {
		label: 'Window',
		role: 'window',
		submenu: [{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize'
		}, {
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close'
		}, {
			type: 'separator'
		}, {
			label: 'Reopen Window',
			accelerator: 'CmdOrCtrl+Shift+T',
			enabled: false,
			key: 'reopenMenuItem',
			click: function () {
				app.emit('activate')
			}
		}]
	}, {
		label: 'Help',
		role: 'help',
		submenu: [{
			label: 'Learn More',
			click: function () {
				electron.shell.openExternal('http://electron.atom.io')
			}
		}]
	}];

function addUpdateMenuItems(items, position) {
	if (process.mas) return;

	const version = electron.app.getVersion();
	let updateItems = [{
		label: `Wrapper version ${version}`,
		enabled: false
		/*}, {
			label: 'Checking for Update',
			enabled: false,
			key: 'checkingForUpdate'
		}, {
			label: 'Check for Update',
			visible: false,
			key: 'checkForUpdate',
			click: function () {
				require('electron').autoUpdater.checkForUpdates()
			}
		}, {
			label: 'Restart and Install Update',
			enabled: true,
			visible: false,
			key: 'restartToUpdate',
			click: function () {
				require('electron').autoUpdater.quitAndInstall()
			}*/
	}];

	items.splice.apply(items, [position, 0].concat(updateItems));
}

function findReopenMenuItem() {
	const menu = Menu.getApplicationMenu();
	if (!menu) return;

	let reopenMenuItem;
	menu.items.forEach(function (item) {
		if (item.submenu) {
			item.submenu.items.forEach(function (item) {
				if (item.key === 'reopenMenuItem') {
					reopenMenuItem = item
				}
			})
		}
	});
	return reopenMenuItem;
}

if (process.platform === 'darwin') {
	const name = electron.app.getName();
	template.unshift({
		label: name,
		submenu: [{
			label: `About ${name}`,
			role: 'about'
		}, {
			type: 'separator'
		}, {
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click: function (item, focusedWindow) {
				if (focusedWindow) {
					// on reload, start fresh and close any old
					// open secondary windows
					if (focusedWindow.id === 1) {
						BrowserWindow.getAllWindows().forEach(function (win) {
							if (win.id > 1) {
								win.close()
							}
						})
					}
					focusedWindow.reload()
				}
			}
		}, {
			label: 'Toggle Full Screen',
			accelerator: (function () {
				if (process.platform === 'darwin') {
					return 'Ctrl+Command+F'
				} else {
					return 'F11'
				}
			})(),
			click: function (item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
				}
			}
		}, {
			label: 'Toggle Developer Tools',
			accelerator: (function () {
				if (process.platform === 'darwin') {
					return 'Alt+Command+I'
				} else {
					return 'Ctrl+Shift+I'
				}
			})(),
			click: function (item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.toggleDevTools()
				}
			}
		}, {
			type: 'separator'
		}, {
			label: `Hide ${name}`,
			accelerator: 'Command+H',
			role: 'hide'
		}, {
			label: 'Hide Others',
			accelerator: 'Command+Alt+H',
			role: 'hideothers'
		}, {
			label: 'Show All',
			role: 'unhide'
		}, {
			type: 'separator'
		}, {
			label: 'Quit',
			accelerator: 'Command+Q',
			click: function () {
				app.quit()
			}
		}]
	});

	// Window menu.
	template[6].submenu.push({
		type: 'separator'
	}, {
			label: 'Bring All to Front',
			role: 'front'
		});

	addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
	const helpMenu = template[template.length - 1].submenu;
	addUpdateMenuItems(helpMenu, 0)
}

// TODO: [Amila] This method is added short term basis
function showToBeImplementedMessage(focusedWindow) {
	const options = {
		type: 'info',
		  title: 'Information',
		  buttons: ['Ok'],
		  message: 'This feature is not developed yet. Please wait for future releases. Thanks for your intrest shown in our app...!'
	};
	electron.dialog.showMessageBox(focusedWindow, options, function () {})
}

function postMenuClickToRubix(item, focusedWindow) {
	postMessageToRubix("{channel: 'Wrapper', message: 'Message sent from electron'}");
}
// ****************************************************************************
// End Menu Related
// ****************************************************************************

function postMessageToRubix(msg) {
	// mainWindow.webContents.executeJavaScript("window.postMessage(["+msg+"], '*')");
	mainWindow.webContents.send('onWebInvoke' , {msg:'hello from main process 2222'});
}

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1800,
		height: 1600,
		show: false,
		minWidth: 1024,
		minHeight: 768
	});
	mainWindow.setMenu(null);
	mainWindow.loadURL(`https://rubixglobal-qa.mubashertrade.com/`);
	// mainWindow.loadURL(`http://localhost:4200`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null
	});

	mainWindow.webContents.on('did-finish-load', () => {
		if (splashWin) {
			splashWin.close();
		}

		// mainWindow.maximise();
		mainWindow.show();

		// Pass the version information to Rubix
		let platform = 'windows';
		if (process.platform !== 'darwin') {
			platform = 'macos'
		}

		msg = "{'os':'" + platform + "','wrapper_type':'desktop_wrapper','wrapperVersion':'" + "1.0.0" + "'}";
		postMessageToRubix(msg);
	})
}

app.on('ready', function () {
	createWindow();

	// Create the child window
	const modalPath = path.join('file://', __dirname, 'assets/splash/splash.html');
	splashWin = new BrowserWindow({
		width: 576,
		height: 332,
		show: true,
		frame: false,
		alwaysOnTop: true
	});

	splashWin.on('close', function () { splashWin = null });
	splashWin.loadURL(modalPath);
	splashWin.show()

	// const menu = Menu.buildFromTemplate(template)
	// Menu.setApplicationMenu(menu)
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}

	let reopenMenuItem = findReopenMenuItem();
	if (reopenMenuItem) reopenMenuItem.enabled = true
});

app.on('browser-window-created', function () {
	let reopenMenuItem = findReopenMenuItem();
	if (reopenMenuItem) reopenMenuItem.enabled = false
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
});

ipcMain.on('onNativeInvoke', function(event, arg) {
	switch(arg.eventType){
		case EventType.SHOW_MENU:
			const menu = Menu.buildFromTemplate(template);
			Menu.setApplicationMenu(menu);
			break;
  }
});

ipcMain.on('onNativeInvokeSync', function(event, arg) {
	//TODO:[Malinda] implement method body
  	event.returnValue = 'temp';
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
