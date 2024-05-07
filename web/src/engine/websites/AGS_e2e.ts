import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ags',
        title: 'AGS (Animated Glitched Comics)'
    },
    container: {
        url: 'https://agscomics.com/series/reincarnated-as-the-mastermind-of-the-story/',
        id: '/series/reincarnated-as-the-mastermind-of-the-story/',
        title: 'Reincarnated as the Mastermind of the Story'
    },
    child: {
        id: '/reincarnated-as-the-mastermind-of-the-story-chapter-14/',
        title: 'Chapter 14'
    },
    entry: {
        index: 1,
        size: 1_643_736,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());