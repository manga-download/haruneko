import { DI } from '@microsoft/fast-element/di.js';
import { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';

export {
    InteractiveFileContentProvider,
    type InteractiveFileContentProvider as IInteractiveFileContentProvider
};

export const InteractiveFileContentProviderRegistration = DI.createContext<InteractiveFileContentProvider>();