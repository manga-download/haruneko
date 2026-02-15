# Setup

The latest desktop client can be downloaded from the [GitHub Releases](https://github.com/manga-download/haruneko/releases) page.

## Windows (Installation)

TBD

## Windows (Portable)

1. Download the latest portable ZIP archive matching your architecture (if unsure get the _Windows 64-Bit Portable_)
2. Extract the files to a directory with read/write access for the current windows user account
3. Open the extracted directory and start the _hakuneko-app.exe_ binary

::: warning IMPORTANT
In case the binary file is missing, ensure that it was not removed by your anti-virus programm such as Windows Defender.
:::

## MacOS

1. Download the latest DMG image matching your architecture
2. Mount and open the DMG image with Finder
3. Copy the _HakuNeko.app_ application to your local _Applications_ folder
4. Open Launchpad and start _HakuNeko_

::: warning IMPORTANT
When MacOS complains that the application is damaged, launch a terminal and remove the extended attributes.

```zsh
xattr -r -c /Applications/HakuNeko.app
```

When MacOS complains that the application can't be opened, launch a terminal and add the executable permission.

```zsh
chmod -R +X /Applications/HakuNeko.app
```

:::

::: warning IMPORTANT
Confirm MacOS dialogs about verifying the application or an unknown developer with the _Done_ button. Afterwards make sure to unblock HakuNeko in _Settings » Privacy & Security_ with the _Open Anyway_ button.
:::

## Linux

### Snap (Ubuntu/Debian/Fedora)

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/hakuneko-electron)

1. Install snapd if not already available
2. Install HakuNeko using: `snap install hakuneko-electron`
3. Launch HakuNeko from your application menu

### Flatpak (All Distributions)

1. Ensure Flatpak is installed on your system
2. Download the latest `.flatpak` file from [GitHub Releases](https://github.com/manga-download/haruneko/releases)
3. Install the Flatpak: `flatpak install <downloaded-file>.flatpak`
   (Replace `<downloaded-file>` with the actual filename, e.g., `hakuneko-electron-linux-x64.flatpak`)
4. Launch HakuNeko from your application menu or use: `flatpak run org.hakuneko.HakuNeko`

::: info
Flatpak provides better distribution compatibility and sandboxing for enhanced security.
:::