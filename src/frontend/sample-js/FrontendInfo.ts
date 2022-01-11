import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'sample-js',
    Label: 'Sample (Pure JS)',
    Description: 'A sample frontend purely in JS ...',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};