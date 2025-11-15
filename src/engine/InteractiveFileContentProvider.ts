export class InteractiveFileContentProvider {

    public IsAbortError(error: Error): boolean {
        return error instanceof DOMException && error.name === 'AbortError';
    }

    public async LoadFile(options?: OpenFilePickerOptions): Promise<Blob | undefined> {
        const files = await window.showOpenFilePicker(options);
        return files[0].getFile();
    }

    public async SaveFile(data: Blob, options?: SaveFilePickerOptions): Promise<void> {
        const file = await window.showSaveFilePicker(options);
        const stream = await file.createWritable();
        await stream.write(data);
        await stream.close();
    }

    public async PickDirectory(startIn: WellKnownDirectory | FileSystemHandle): Promise<FileSystemDirectoryHandle> {
        return window.showDirectoryPicker({ startIn });
    }
}