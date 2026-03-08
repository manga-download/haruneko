import { FileExplorer as Channels } from '../../../../../app/src/ipc/Channels';
import { SanitizeFileName } from '../../StorageController';
import { Key, Scope } from '../../SettingsGlobal';
import type { Check, Directory } from '../../SettingsManager';
import GetIPC from '../InterProcessCommunication';

const MediaPathStorageKey = 'FileExplorer::MediaDirectoryPath';

function GetStoredMediaPath(): string | null {
    return localStorage.getItem(MediaPathStorageKey);
}

function SetStoredMediaPath(path: string): void {
    localStorage.setItem(MediaPathStorageKey, path);
}

/**
 * Ensure the media directory base path is known.
 * If not stored, prompt the user to select it via Electron's native dialog.
 * Returns the base path or null if the user cancelled.
 */
async function EnsureMediaPath(): Promise<string | null> {
    const stored = GetStoredMediaPath();
    if (stored) return stored;
    const confirmed = confirm('To open folders in the file explorer, please select your media directory.\n\nThis should be the same folder configured in Settings > Media Directory.');
    if (!confirmed) return null;
    const picked = await GetIPC().Send<string | null>(Channels.App.PickDirectory);
    if (picked) {
        SetStoredMediaPath(picked);
    }
    return picked;
}

/**
 * Build the full folder path for a manga's chapter directory.
 */
function BuildFolderPath(basePath: string, websiteTitle: string | undefined, mangaTitle: string): string {
    const settings = HakuNeko.SettingsManager.OpenScope(Scope);
    const useSubDir = settings.Get<Check>(Key.UseWebsiteSubDirectory).Value;
    const parts = [basePath];
    if (useSubDir && websiteTitle) {
        parts.push(SanitizeFileName(websiteTitle));
    }
    parts.push(SanitizeFileName(mangaTitle));
    // Use forward slash, Electron's shell.openPath normalizes it
    return parts.join('/');
}

/**
 * Open the manga's download folder in the system file explorer.
 * On first use, prompts the user to locate their media directory.
 */
export async function ShowMangaInFolder(websiteTitle: string | undefined, mangaTitle: string): Promise<void> {
    const basePath = await EnsureMediaPath();
    if (!basePath) return;
    const folderPath = BuildFolderPath(basePath, websiteTitle, mangaTitle);
    await GetIPC().Send(Channels.App.ShowInFolder, folderPath);
}

/**
 * Clear the stored media directory path (e.g. when the user changes the media directory setting).
 */
export function ClearStoredMediaPath(): void {
    localStorage.removeItem(MediaPathStorageKey);
}
