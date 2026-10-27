import { describe, beforeEach, it, expect } from 'vitest';
import { TestFixture } from './FrontendFluentCore_fixture';

describe('Front-End (Fluent-Core)', { concurrent: false, timeout: 60_000 }, () => {

    const fixture = new TestFixture();

    beforeEach(async ctx => {
        ctx.onTestFailed(() => fixture.Screenshot('Test Failed'));
        await fixture.Reset('fluent-core');
        await fixture.WaitForSelectors(10_000, 'div#app > fluent-app');
        //await fixture.Screenshot(ctx.task.name);
    });

    describe('SmokeTests', async () => {

        it('Should show basic layout', async () => {
            const elements = await fixture.WaitForSelectors(5000,
                'div#app > fluent-app',
                'fluent-app >>> #widgets > #sidepanel',
                'fluent-app >>> #widgets > #mainpanel',
            );
            for (const element of elements) {
                expect(await element.isVisible()).toBe(true);
            }
        });
    });
});