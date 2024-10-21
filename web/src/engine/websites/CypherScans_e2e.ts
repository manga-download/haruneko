﻿import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cypherscans',
        title: 'CypherScans'
    },
    container: {
        url: 'https://cypher-scans.xyz/manga/solo-max-level-newbie/',
        id: '/manga/solo-max-level-newbie/',
        title: 'Solo Max-Level Newbie'
    },
    child: {
        id: '/solo-max-level-newbie-chapter-130/',
        title: 'Chapter 130'
    },
    entry: {
        index: 0,
        size: 823_040,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());