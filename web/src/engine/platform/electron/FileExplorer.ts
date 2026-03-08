import { FileExplorer as Channels } from '../../../../../app/src/ipc/Channels';
import { SanitizeFileName } from '../../StorageController';
import { Key, Scope } from '../../SettingsGlobal';
import { MangaExportFormat } from '../../exporters/MangaExporterRegistry';
import type { Check, Choice, Directory, Text } from '../../SettingsManager';
import GetIPC from '../InterProcessCommunication';
import { Scope_Viewer, Key as ViewerKey } from '../../../frontend/classic/stores/Settings';

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

/**
 * Open a URL in the system's default browser.
 */
export async function OpenExternal(url: string): Promise<void> {
    await GetIPC().Send(Channels.App.OpenExternal, url);
}

/**
 * Open a native file picker to select an executable.
 * Returns the selected file path, or null if cancelled.
 */
export async function PickExternalViewer(): Promise<string | null> {
    return GetIPC().Send<string | null>(Channels.App.PickFile);
}

const ExportFormatExtensions: Record<string, string> = {
    [MangaExportFormat.RAWs]: '',
    [MangaExportFormat.CBZ]: '.cbz',
    [MangaExportFormat.EPUB]: '.epub',
    [MangaExportFormat.PDF]: '.pdf',
};

/**
 * Launch a chapter in the configured external viewer program.
 * Returns true if the external viewer was launched, false if not configured.
 */
export async function LaunchExternalViewer(websiteTitle: string | undefined, mangaTitle: string, chapterTitle: string): Promise<boolean> {
    const viewerSettings = HakuNeko.SettingsManager.OpenScope(Scope_Viewer);
    const externalViewer = viewerSettings.Get<Text>(ViewerKey.ExternalViewer)?.Value;
    if (!externalViewer) return false;

    const basePath = await EnsureMediaPath();
    if (!basePath) return false;

    const settings = HakuNeko.SettingsManager.OpenScope(Scope);
    const exportFormat = settings.Get<Choice>(Key.MangaExportFormat).Value;
    const extension = ExportFormatExtensions[exportFormat] ?? '';
    const chapterFileName = SanitizeFileName(chapterTitle + extension);

    const mangaFolderPath = BuildFolderPath(basePath, websiteTitle, mangaTitle);
    const chapterPath = mangaFolderPath + '/' + chapterFileName;
    await GetIPC().Send(Channels.App.LaunchProgram, externalViewer, chapterPath);
    return true;
}
