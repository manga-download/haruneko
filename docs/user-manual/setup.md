# Setup

The latest desktop client can be downloaded from the [GitHub Releases](https://github.com/manga-download/haruneko/releases) page.

## Windows (Installation)

TBD

## Windows (Portable)

1. Download the latest portable ZIP archive matching your architecture (if unsure get the _Windows 64-Bit Portable_)
2. Extract the files to a directory with read/write access for the current windows user account
3. Open the extracted directory and start the _hakuneko-app.exe_ binary

::: warning IMPORTANT
In case the binary file is missing, ensure that it was not removed by your anti-virus program such as Windows Defender.
:::

## MacOS

1. Download the latest DMG image matching your architecture
2. Mount and open the DMG image with Finder
3. Copy the _HakuNeko.app_ application to your local _Applications_ folder
4. Open Launchpad and start _HakuNeko_

::: warning IMPORTANT
When MacOS complains that the application is damaged, launch a terminal alongside the _HakuNeko.app_ folder and remove the extended attributes.
```zsh
xattr -r -c ./HakuNeko.app
```
When MacOS complains that the application can't be opened, launch a terminal alongside the _HakuNeko.app_ folder and add the executable permission.
```zsh
chmod -R +X ./HakuNeko.app
```
:::

::: warning IMPORTANT
Confirm MacOS dialogs about verifying the application or an unknown developer with the _Done_ button. Afterwards make sure to unblock HakuNeko in _Settings » Privacy & Security_ with the _Open Anyway_ button.
:::

## Linux

TBD