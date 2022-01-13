import { Setup, Teardown } from './PuppeteerFixture';
import Hiperdex from '../src/engine/websites/Hiperdex.e2e';
import Leitor from '../src/engine/websites/Leitor.e2e';
import ScansMangas from '../src/engine/websites/ScansMangas.e2e';
import Toonily from '../src/engine/websites/Toonily.e2e';

describe('End-to-End Test Suite for all Websites', () => {

    jest.setTimeout(25000);

    beforeAll(async () => {
        await Setup();
    });

    afterAll(async () => {
        await Teardown();
    });

    describe('Hiperdex', Hiperdex);
    describe('Leitor', Leitor);
    describe('ScansMangas', ScansMangas);
    describe('Toonily', Toonily);
});