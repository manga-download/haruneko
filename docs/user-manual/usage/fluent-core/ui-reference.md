# User Interface Reference (Fluent-Core)

This front-end is focused on being used by developers.
It provides a specialized experience and tailored functionalities but lacks in general usability.

**ℹ️ Most UI elements will provide context help, so make sure to read the tooltip which will appear after a short delay when hovering the cursor over the corresponding UI element**

## Layout

The fundamental functionality is provided within a fixed set of panels.
Additional functionalities or configurations can be found in the [Menu](#menu).

![](./assets/overview.png)

## Menu

The menu provies extended functionality and configuration.
To open the menu, click the corresponding icon in the upper left corner of the application.
To close the menu, click the button again or any space in the application other than the menu.

The menu contains entries to toggle the visibility of the [Bookmark Panel](#bookmark-panel) and the [Download Panel](#download-panel).
The menu also provides an entry to open the [Settings](#application-settings) dialog.
There additional entries to import and export bookmarks.
This can either be used to migrate all bookmarks from the previous version of HakuNeko (legacy) or to backup and restore the current list of bookmarks to/from a file.
At the bottom is a slider for setting the brightness (dark/light mode) of this frontend (does not affect the other frontends).

There is also a sub-menu for toggle certain developer focused features on/off.
These will not be further explained (check the corresponding tooltips).

![](./assets/menu.png)

## Application Settings

These settings can be reached via the [Menu](#menu).
This dialog contains all application specific options that can be configured by the user.
The dialog can be confirmed with the _Done_ button at the bottom center of the dialog.

![](./assets/settings-application.png)

| Label                 | Description |
| :-------------------- | :---------- |
| Frontend              | Shows a list of all available user interfaces. Select a user interface which delivers an appealing experience. A restart is required after changing the user interface. |
| Language              | Shows a list of all available languages for the application. Select a language convenient for you. This does not affect languages of the accessed titles and media |
| Media Directory       | The directory where all media shall be stored.<br>⚠️ **Make sure this is set correctly after the first launch of HakuNeko to prevent errors and confusion!** |
| Use Sub-Directories   | ... |
| De-Scrambling Format  | ... |
| De-Scrambling Quality | ... |
| ...                   | ... |
| RPC | ... |

## Bookmark Panel

This panel shows the _Bookmark Manager_ and can be shown or hidden via the [Menu](#menu).
This list contains all titles from websites that were bookmarked by the user.
The counter in the top right corner shows the number of bookmarks in this list and the number of bookmarks which are currently filtered by applying the search.
The search field supports a simple text input that can be entered by the user.
Furthermore a clear button in the search box can be used to quickly reset the text input.

A bookmark in the list can be clicked to select its corresponding website in the [Website Selection Panel](#website-selection-panel) and select its corresponding title in the [Title Selection Panel](#title-selection-panel).

![](./assets/panel-bookmarks.png)

## Download Panel

This panel shows the _Download Manager_.

![](./assets/panel-downloads.png)

## Website Selection Panel

...

![](./assets/panel-website.png)

## Title Selection Panel

...

![](./assets/panel-titles.png)

## Media Selection Panel

...

![](./assets/panel-items.png)

## Media Preview

...

![](./assets/preview.png)

## Website Settings

...

![](./assets/settings-website.png)

## Developer Tools

The chrome developer tools can be opened by pressing the `F12` keyboard key.