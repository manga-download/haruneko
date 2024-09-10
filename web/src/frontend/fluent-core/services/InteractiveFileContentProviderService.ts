import { DI, Registration } from '@microsoft/fast-element/di.js';
import { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';

export const InteractiveFileContentProviderService = DI.createContext<InteractiveFileContentProvider>();
DI.getOrCreateDOMContainer(document.body).register(Registration.instance(InteractiveFileContentProviderService, new InteractiveFileContentProvider()));