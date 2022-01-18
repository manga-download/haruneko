import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'classic',
    Label: 'Classic',
    Description: 'The standard frontend, no bells no whistles ...',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};