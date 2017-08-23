const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splashWin;

// ****************************************************************************
// Menu Related
// ****************************************************************************

let template = [{
	label: 'Trading',
	submenu: [{
		label: 'Portfolio',
		accelerator: 'CmdOrCtrl+P',
		click: function (item, focusedWindow) {
			postMenuClickToRubix(item, focusedWindow);
		}
	}, {
		label: 'Order List',
		accelerator: 'CmdOrCtrl+O',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Account Summary',
		accelerator: 'CmdOrCtrl+A',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Order Search',
		accelerator: 'CmdOrCtrl+S',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Account Statement',
		// accelerator: 'CmdOrCtrl+T',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Requests',
		accelerator: 'CmdOrCtrl+X',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}]
}, {
	label: 'Watchlist',
	submenu: [{
		label: 'Full Market',
		accelerator: 'CmdOrCtrl+F',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Trading Conslose',
		accelerator: 'CmdOrCtrl+T',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Graphical Watchlist',
		// accelerator: 'CmdOrCtrl+A',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Grid Watchlist',
		// accelerator: 'CmdOrCtrl+S',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Smart Watchlist',
		// accelerator: 'CmdOrCtrl+T',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, { 
		type: 'separator'
	}, {
		label: 'Create Watchlist',
		// accelerator: 'CmdOrCtrl+R',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, { 
		type: 'separator'
	}, {
		label: 'My Watchlist 01',
		// accelerator: 'CmdOrCtrl+R',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}]
}, {
	label: 'Analysis',
	submenu: [{
		label: 'Chart',
		accelerator: 'CmdOrCtrl+L',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Research',
		// accelerator: 'CmdOrCtrl+O',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Screener',
		// accelerator: 'CmdOrCtrl+A',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Stock Profile',
		// accelerator: 'CmdOrCtrl+S',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Top Stocks',
		// accelerator: 'CmdOrCtrl+T',
		click: function (item, focusedWindow) {
			postMenuClickToRubix(item, focusedWindow);
		}
	}]
}, {
	label: 'Market',
	submenu: [{
		label: 'Announcements',
		// accelerator: 'CmdOrCtrl+P',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'News',
		// accelerator: 'CmdOrCtrl+O',
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
		label: 'Sector Summary',
		// accelerator: 'CmdOrCtrl+S',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}, {
		label: 'Mutual Funds',
		// accelerator: 'CmdOrCtrl+T',
		click: function (item, focusedWindow) {
			showToBeImplementedMessage(focusedWindow);
		}
	}]
}, {
	label: 'My Alerts',
	submenu: [{
		label: 'Price Alerts',
		// accelerator: 'CmdOrCtrl+P',
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
}]

function addUpdateMenuItems(items, position) {
	if (process.mas) return

	const version = electron.app.getVersion()
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
	}]

	items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
	const menu = Menu.getApplicationMenu()
	if (!menu) return

	let reopenMenuItem
	menu.items.forEach(function (item) {
		if (item.submenu) {
			item.submenu.items.forEach(function (item) {
				if (item.key === 'reopenMenuItem') {
					reopenMenuItem = item
				}
			})
		}
	})
	return reopenMenuItem
}

if (process.platform === 'darwin') {
	const name = electron.app.getName()
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
	})

	// Window menu.
	template[6].submenu.push({
		type: 'separator'
	}, {
			label: 'Bring All to Front',
			role: 'front'
		})

	addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
	const helpMenu = template[template.length - 1].submenu
	addUpdateMenuItems(helpMenu, 0)
}

// TODO: [Amila] This method is added short term basis
function showToBeImplementedMessage(focusedWindow) {
	const options = {
		type: 'info',
		  title: 'Information',
		  buttons: ['Ok'],
		  message: 'This feature is not developed yet. Please wait for future releases. Thanks for your intrest shown in our app...!'
	}
	electron.dialog.showMessageBox(focusedWindow, options, function () {})
}

function postMenuClickToRubix(item, focusedWindow) {
	postMessageToRubix("{channel: 'Wrapper', message: 'Message sent from electron'}");
}
// ****************************************************************************
// End Menu Related
// ****************************************************************************

function postMessageToRubix(msg) {
	mainWindow.webContents.executeJavaScript("window.postMessage(["+msg+"], '*')");	
}

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1800,
		height: 1600,
		show: false,
		minWidth: 1024,
		minHeight: 768
	})

	// mainWindow.loadURL(`https://rubix.mubashertrade.com/rubix-global/desktop`);
	mainWindow.loadURL(`http://localhost:4200/desktop`);
	
	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null
	})

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
	const modalPath = path.join('file://', __dirname, 'assets/splash/splash.html')
	splashWin = new BrowserWindow({
		width: 576,
		height: 332,
		show: true,
		frame: false,
		alwaysOnTop: true
	});

	splashWin.on('close', function () { splashWin = null })
	splashWin.loadURL(modalPath)
	splashWin.show()

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}

	let reopenMenuItem = findReopenMenuItem()
	if (reopenMenuItem) reopenMenuItem.enabled = true
})

app.on('browser-window-created', function () {
	let reopenMenuItem = findReopenMenuItem()
	if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
