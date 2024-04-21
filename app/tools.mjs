import path from 'node:path';
import fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import stream from 'node:stream/promises';
import { exec } from 'node:child_process';

/**
 * Wait for a certain amount of timing before continuing processing.
 * @param time - The time to wait in milliseconds
 */
export async function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Clear all content within the given directory.
 */
export async function purge(directory) {
    await fs.rm(directory, { force: true, recursive: true }); // force => ignore error if not exist
    await fs.mkdir(directory);
}

/**
 * Download a file from an online resource.
 * @param source - The URI from which the file shall be downloaded
 * @param target - The file path where the source shall be stored locally
 */
export async function download(source, target) {
    const response = await fetch(source);
    const file = await fs.open(target, 'w', 0o755);
    const filestream = file.createWriteStream(target, { highWaterMark: 262144 });
    try {
        await stream.finished(Readable.fromWeb(response.body).pipe(filestream));
    } finally {
        filestream.close();
    }
}

/**
 * Run the given command within a spawned shell.
 * @param command - The command including arguments
 * @param cwd - The current working directory for the spawned shell
 * @returns A promise that is resolved when the process finished succesfully, otherwise a rejected promise
 */
export async function run(command, cwd) {
    return new Promise((resolve, reject) => {
        console.log('Shell Exec:', command);
        const proc = exec(command, {
            cwd: cwd ? path.resolve(cwd) : undefined
        });
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
        //proc.stdout.on('data', chunk => console.log(chunk.toString('utf8')));
        proc.on('error', error => reject(error));
        proc.on('exit', code => {
            if (parseInt(code) === 0) {
                resolve();
            } else {
                reject(new Error(`Process "${command.split(' ').shift()}" exit with code ${code}`));
            }
        });
    });
}