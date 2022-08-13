import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'barely-fluent',
    Label: 'Barely Fluent',
    Description: 'A simple frontend with no bells and whistles, especially for developers to quickly verify essential functionality',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};