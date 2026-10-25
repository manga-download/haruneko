import { describe, beforeEach, it, expect } from 'vitest';
import { TestFixture } from './FrontendFluentCore_fixture';

describe('Front-End (Fluent-Core)', { concurrent: false, timeout: 60_000 }, () => {

    const fixture = new TestFixture();

    beforeEach(async ctx => {
        ctx.onTestFailed(() => fixture.Screenshot());
        await fixture.Reset('fluent-core');
        await fixture.WaitForSelectors(10_000, 'div#app > fluent-app');
    });

    describe('SmokeTests', async () => {

        it('Should show basic layout', async () => {
            const elements = await fixture.WaitForSelectors(0,
                'div#app > fluent-app',
            );
            for (const element of elements) {
                expect(await element.isVisible()).toBe(true);
            }
        });
    });
});