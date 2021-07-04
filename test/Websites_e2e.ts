import { Setup, Teardown } from './PuppeteerFixture';
import HiperdexTests from '../src/engine/websites/Hiperdex_e2e';
import LeitorTests from '../src/engine/websites/Leitor_e2e';

describe('End-to-End Test Suite for all Websites', () => {

    jest.setTimeout(25000);

    beforeAll(async () => {
        await Setup();
    });

    afterAll(async () => {
        await Teardown();
    });

    describe('Hiperdex', HiperdexTests);
    describe('Leitor', LeitorTests);
});