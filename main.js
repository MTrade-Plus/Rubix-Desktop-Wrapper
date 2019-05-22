const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const app = electron.app;
const ipcMain = require('electron').ipcMain;
const MIN_WIDTH = 1280; // Minimum supported resolution - HD
const MIN_HEIGHT = 768; // Minimum supported resolution - HD

const path = require('path');
const url = require('url');

const EventType = {
	SHOW_MENU : 'SHOW_MENU',
    MENU_CLICK : 'MENU_CLICK',
};

const ConfigurableMenuItems = {
    Store : 'Store',
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splashWin;

let dynamicMenuItemsAdded = false;

// ****************************************************************************
// Menu Related
// ****************************************************************************

let template = [
	{
    	label: 'Home',
    	submenu: [{
                label: 'Trading Console',
                accelerator: 'CmdOrCtrl+T',
				id: 'oneStopTrade',
                click: function (item, focusedWindow) {
                    postMenuClickToRubix(item, focusedWindow);
                }
            }/*, {
            label: 'Mubasher Store',
            id: 'Store',
            accelerator: 'CmdOrCtrl+S',
            click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
            }
		}*/]
	}, {
		label: 'Trading Account',
    	submenu: [{
			label: 'Portfolio',
            id: 'portfolio',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Orders',
            id: 'orders',
			accelerator: 'CmdOrCtrl+O',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Account Details',
            id: 'accountDetails',
			// accelerator: 'CmdOrCtrl+A',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Deposit & Withdrawals',
            id: 'depositWithdraw',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Focus List',
            id: 'focusList',
			// accelerator: 'CmdOrCtrl+T',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}]
	}, {
		label: 'Market',
		submenu: [{
			label: 'Market Overview',
            id: 'marketOverview',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Watchlist',
            id: 'watchList',
			accelerator: 'CmdOrCtrl+O',
			id: 'watchList',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Global Markets',
            id: 'globalMarkets',
			// accelerator: 'CmdOrCtrl+A',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'News & Announcements',
            id: 'newsAnn',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}]
	}, {
		label: 'Analytics',
		submenu: [{
			label: 'Top Stocks',
            id: 'topStocks',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
            type: 'separator'
        }, {
			label: 'Chart',
            id: 'chart',
			accelerator: 'CmdOrCtrl+C',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Stock Profile',
            id: 'stockProfile',
			// accelerator: 'CmdOrCtrl+A',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
            type: 'separator'
        }, {
			label: 'Screener',
            id: 'screener',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Research',
            id: 'research',
			// accelerator: 'CmdOrCtrl+T',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}]
	}, {
		label: 'Services',
		submenu: [{
			label: 'My Alerts',
            id: 'myAlerts',
			accelerator: 'CmdOrCtrl+W',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
			}
		}, {
			label: 'Settings',
            id: 'preferences',
			// accelerator: 'CmdOrCtrl+T',
			click: function (item, focusedWindow) {
                postMenuClickToRubix(item, focusedWindow);
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
		}/*, {
			label: 'Reopen Window',
			accelerator: 'CmdOrCtrl+Shift+T',
			enabled: false,
			key: 'reopenMenuItem',
			click: function () {
				app.emit('activate')
			}
		}*/]
	}, {
		label: 'Help',
		role: 'help',
		submenu: [{
			label: 'Learn More',
            enabled: false,
			click: function () {
				electron.shell.openExternal('http://electron.atom.io')
			}
		}]
	},
	];

const name = electron.app.getName();

const macDefaultMenuItems = {
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
};


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
	template.unshift(macDefaultMenuItems);

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

function postMenuClickToRubix(item, focusedWindow) {
	postMessageToRubix(EventType.MENU_CLICK, item.id);
}
// ****************************************************************************
// End Menu Related
// ****************************************************************************

function postMessageToRubix(type, msg) {
	// mainWindow.webContents.executeJavaScript("window.postMessage(["+msg+"], '*')");E
    switch(type){
        case EventType.MENU_CLICK:
            mainWindow.webContents.send('onWebInvoke' , {msg:msg, type: type});
            break;
		default:
			// error log
    }
}

function createWindow() {
	const mainScreen = electron.screen.getPrimaryDisplay();
	// console.log(mainScreen.size.width);
	// console.log(mainScreen.size.height);
	// console.log(mainScreen.workAreaSize.width);
	// console.log(mainScreen.workAreaSize.height);
	if (mainScreen.size.width < MIN_WIDTH || mainScreen.size.height < MIN_HEIGHT) {
		electron.dialog.showErrorBox('Resolution not supported', 'MTPlus Desktop version support HD resolution and above only (1280 x 768). Please adjust your resolution to HD or use our web version in your current resolution');
		
		if (splashWin) {
			splashWin.close();
		}

		if (mainWindow) {
			mainWindow.close();
		}

		splashWin = null;
		mainWindow = null;

		app.quit();
		
		return false;
	}

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width:  mainScreen.workAreaSize.width,
		height: mainScreen.workAreaSize.height,
		show: false,
		title: 'MTrade Plus',
		minWidth: MIN_WIDTH,	
		minHeight: MIN_HEIGHT
	});

	mainWindow.setMenu(null);
	// QA
	// mainWindow.loadURL(`https://rubixglobal-qa.mubashertrade.com/desktop`);
	// UAT
	// mainWindow.loadURL(`https://rubixglobal-uat.mubashertrade.com/desktop`);
	// Prod
	mainWindow.loadURL(`https://rubixglobal.mubashertrade.com/desktop`);
	
	// Localhost
	// mainWindow.loadURL(`http://localhost:4200/desktop`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null
	});

	mainWindow.webContents.on('did-finish-load', () => {
		if (splashWin) {
			splashWin.close();
		}

		mainWindow.maximize();
		mainWindow.show();

		// Pass the version information to Rubix
		let platform = 'windows';
		if (process.platform !== 'darwin') {
			platform = 'macos'
		}

		msg = "{'os':'" + platform + "','wrapper_type':'desktop_wrapper','wrapperVersion':'" + "1.0.0" + "'}";
		postMessageToRubix(msg);
	});

	return true;
}

app.on('ready', function () {
	if (!createWindow()) {
		return;
	}

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

app.on('browser-window-created', function (event,window) {
    window.setMenu(null);
	/*let reopenMenuItem = findReopenMenuItem();
	if (reopenMenuItem) reopenMenuItem.enabled = false*/
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
            if (!dynamicMenuItemsAdded) {
                if (arg.data.dynamicMenuItems && arg.data.dynamicMenuItems.length > 0) {
                    for (const item of  arg.data.dynamicMenuItems) {
                        switch(item.configItem){
                            case ConfigurableMenuItems.Store:
                            	if (process.platform === 'darwin') {
                                    template[1].submenu.push({
                                        label: 'Mubasher Invest',
                                        id: 'store',
                                        accelerator: 'CmdOrCtrl+S',
                                        click: function (item, focusedWindow) {
                                            postMenuClickToRubix(item, focusedWindow);
                                        }
                                    });
								} else {
                                    template[0].submenu.push({
                                        label: 'Mubasher Invest',
                                        id: 'store',
                                        accelerator: 'CmdOrCtrl+S',
                                        click: function (item, focusedWindow) {
                                            postMenuClickToRubix(item, focusedWindow);
                                        }
                                    });
								}
                                break;
                            default:
                            // error log
                        }
                    }
                    dynamicMenuItemsAdded = true;
                }
            }
			const menu = Menu.buildFromTemplate(template);
			if (arg.data.show) {
                Menu.setApplicationMenu(menu);
			} else {
				if (process.platform === "darwin") {   //  Menu.setApplicationMenu(null); has no effect on mac
                    const logoutMenu = Menu.buildFromTemplate(template.slice(0,1));
                    Menu.setApplicationMenu(logoutMenu);
				} else {
                    Menu.setApplicationMenu(null);
				}
			}

			break;
  }
});

ipcMain.on('onNativeInvokeSync', function(event, arg) {
	//TODO:[Malinda] implement method body
  	event.returnValue = 'temp';
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
