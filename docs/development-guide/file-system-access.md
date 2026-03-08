# File System Access and "Show in Folder"

This document explains how HakuNeko accesses the filesystem for downloads, and why the "Show in Folder" feature works the way it does.

## How downloads work

HakuNeko uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) for all file operations. When the user selects a media directory in settings, `showDirectoryPicker()` returns a `FileSystemDirectoryHandle`. This handle is used to create subdirectories, write files, and check for existing downloads all through the browser API.

The handle is stored in IndexedDB (via `StorageControllerBrowser`) and survives application restarts. IndexedDB supports `FileSystemDirectoryHandle` through the structured clone algorithm, so the user doesn't have to re-pick their folder every time.

However, the **permission** to access the directory does not survive restarts. On each new session, Chromium revokes the permission grant and the user must re-approve access. This is handled by `Directory.EnsureAccess()`, which calls `queryPermission()` and `requestPermission()` to prompt the user.

## The path problem

The File System Access API is designed as a security sandbox. A `FileSystemDirectoryHandle` lets you read and write files through it, but it intentionally **does not expose the actual filesystem path**. The `.name` property only returns the last segment of the directory name (e.g. `"Downloads"`, not `"C:\Users\you\Downloads"`).

This means:

- We **can** read/write files through the handle (downloads, checking for existing chapters)
- We **cannot** get a path string to pass to the operating system (e.g. for opening a folder in the file explorer)

There is no browser or Electron API to:

- Get the full path from a `FileSystemDirectoryHandle`
- Create a `FileSystemDirectoryHandle` from a known path

Electron had [a PR to add a `.path` property](https://github.com/electron/electron/pull/35604) to handles, but it was never merged because handles don't survive the `contextBridge` with context isolation enabled.

## How "Show in Folder" works around this

Since we need a real path string to call Electron's `shell.openPath()`, and we can't extract it from the handle, we use a separate mechanism:

1. The first time the user clicks "Show in Folder", a `confirm()` dialog explains what's about to happen
2. Electron's `dialog.showOpenDialog()` opens - this is the native OS dialog which **does** return the full path
3. The path is stored in `localStorage` for all future use
4. The path is combined with the manga/website directory names (which we know from the data model) to construct the full folder path
5. This path is sent to the Electron main process via IPC, which calls `shell.openPath()`

When the user changes their media directory in settings, the stored path is automatically cleared. The next "Show in Folder" click will prompt them to select the directory again.

### Why two dialogs?

Ideally, picking the media directory once would give us both the handle (for file operations) and the path (for the file explorer). But:

- `showDirectoryPicker()` gives a handle, no path
- `dialog.showOpenDialog()` gives a path, no handle

There is no way to create one from the other. So the user may see two directory pickers over the lifetime of their setup: one when configuring the media directory (for the handle), and one on first "Show in Folder" use (for the path). After that initial setup, "Show in Folder" works without any prompts.

## Files involved

- `app/src/ipc/Channels.ts` - IPC channel definitions (`FileExplorer` namespace)
- `app/electron/src/ipc/FileExplorer.ts` - Main process handlers (`shell.openPath`, `dialog.showOpenDialog`)
- `web/src/engine/platform/electron/FileExplorer.ts` - Web-side logic (path storage, path construction, IPC calls)
- `web/src/frontend/classic/components/settings/InputDirectory.svelte` - Clears stored path when media directory changes
