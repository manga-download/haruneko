import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'sample-svelte',
    Label: 'Sample (Svelte)',
    Description: 'A sample frontend based on Svelte ...',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};