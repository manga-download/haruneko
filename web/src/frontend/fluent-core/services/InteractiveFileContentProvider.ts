import { DI, Registration } from '@microsoft/fast-element/di.js';
import { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';

export type { InteractiveFileContentProvider };
export const InteractiveFileContentProviderRegistration = DI.createContext<InteractiveFileContentProvider>();
DI.getOrCreateDOMContainer(document.body).register(Registration.instance(InteractiveFileContentProviderRegistration, new InteractiveFileContentProvider()));