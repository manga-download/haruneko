import { DI } from '@microsoft/fast-foundation';
import { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';

export const InteractiveFileContentProviderService = DI.createInterface<InteractiveFileContentProvider>(locator => locator.singleton(InteractiveFileContentProvider));