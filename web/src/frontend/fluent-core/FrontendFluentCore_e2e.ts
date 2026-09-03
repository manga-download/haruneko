import { describe, beforeEach, it/*, expect*/ } from 'vitest';
import { TestFixture } from './FrontendFluentCore_fixture';

describe('Front-End (Fluent-Core)', { concurrent: false, timeout: 60_000 }, () => {

    const fixture = new TestFixture();

    beforeEach(() => fixture.Reset('fluent-core'));

    describe('SmokeTests', async () => {

        it('Should render basic layout', async () => {
            await fixture.WaitForSelectors(5000,
                'div#app > fluent-app',
            );
        });
    });
});