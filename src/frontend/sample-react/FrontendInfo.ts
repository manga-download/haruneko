import type { IFrontendInfo } from '../IFrontend';

export const Info: IFrontendInfo = {
    ID: 'sample-react',
    Label: 'Sample (React)',
    Description: 'A sample frontend based on React ...',
    Screenshots: [],
    LoadModule: async () => (await import('./Frontend')).default
};