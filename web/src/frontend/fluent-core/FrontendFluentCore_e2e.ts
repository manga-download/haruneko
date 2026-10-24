import { describe, beforeEach, it, expect } from 'vitest';
import { TestFixture } from './FrontendFluentCore_fixture';

describe('Front-End (Fluent-Core)', { concurrent: false, timeout: 60_000 }, () => {

    const fixture = new TestFixture();

    beforeEach(async () => {
        await fixture.Reset('fluent-core');
        await fixture.WaitForSelectors(10_000, 'div#app > fluent-app');
    });

    describe('SmokeTests', async () => {

        it('Should show app', async () => {
            const [element] = await fixture.WaitForSelectors(0, 'div#app > fluent-app');
            expect(await element.isVisible()).toBe(true);
        });
    });
});