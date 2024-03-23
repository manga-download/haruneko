import { Menu, MenuItem } from 'electron';

export function InitializeMenu() {
    const menu = new Menu();
    menu.append(new MenuItem({
        role: 'appMenu',
        submenu: [
            { role: 'close' },
            { role: 'quit' },
        ]
    }));
    menu.append(new MenuItem({
        role: 'editMenu',
        submenu: [
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' },
        ]
    }));
    menu.append(new MenuItem({
        role: 'viewMenu',
        submenu: [
            { role: 'toggleDevTools', accelerator: 'F12' },
        ]
    }));
    Menu.setApplicationMenu(menu);
}