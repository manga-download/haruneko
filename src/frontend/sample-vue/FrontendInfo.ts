import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'sample-vue',
    Label: 'Sample (Vue)',
    Description: 'A sample frontend based on Vue ...',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};