import path from 'node:path';
import fs from 'node:fs/promises';
import { mock } from 'vitest-mock-extended';
import { describe, test, expect, afterAll } from 'vitest';
import type { ISettings, SettingsManager } from '../src/engine/SettingsManager';
import type { StorageController } from '../src/engine/StorageController';
import { PluginController } from '../src/engine/PluginController';

enum StatusCode {
    OK = 0,
    WARNING = 1,
    ERROR = 2,
}

type SimilarWebData = {
    GlobalRank: {
        Rank?: number;
    };
    EstimatedMonthlyVisits: Record<string, number>;
}

type Result = {
    id: string;
    title: string;
    url: string;
    status: {
        code: number;
        info: string;
    };
    visitors: number;
    rank: number;
}

const expectedOriginRedirectPatterns = new Map([
    [ 'https://holymanga.net', [ // REASON: The website uses redirects to rotating (sub-)domains (probably to avoid scraping or DMCA)
        /^https:\/\/w+\d*\.holymanga\.net$/,
    ] ],
    [ 'https://manatoki.net', [ // REASON: The website uses redirects to rotating (sub-)domains (probably to avoid scraping or DMCA)
        /^https:\/\/manatoki\d*\.net$/,
    ] ],
    [ 'https://mangafreak.me', [ // REASON: The website uses redirects to rotating (sub-)domains (probably to avoid scraping or DMCA)
        /^https:\/\/w+\d*\.mangafreak\.me$/,
    ] ],
    [ 'https://mintmanga.live', [ // REASON: The website uses redirects to rotating (sub-)domains (probably to avoid scraping or DMCA)
        /^https:\/\/\d+\.mintmanga\.one$/,
    ] ],
    [ 'https://newtoki.com', [ // REASON: The website uses redirects to rotating (sub-)domains (probably to avoid scraping or DMCA)
        /^https:\/\/newtoki\d+\.com$/,
    ] ],
    [ 'https://www.toomics.com', [ // REASON: The website requires a cookie which is set in the Initialize() method to prevent redirection
        /^https:\/\/global\.toomics\.com$/,
    ] ],
    [ 'https://toonkor.com', [ // REASON: The website uses redirects to rotating (sub-)domains (probably to avoid scraping or DMCA)
        /^https:\/\/toonkor\d+\.com$/,
    ] ],
    [ 'https://web.6parkbbs.com', [ // REASON: This is a valid sub-domain to categorize content from its top-level website
        /^https:\/\/club\.6parkbbs\.com$/,
    ] ],
]);

class TestFixture {

    public readonly MockStorageController = mock<StorageController>();
    public readonly MockSettingsManager = mock<SettingsManager>();

    constructor() {
        this.MockSettingsManager.OpenScope.mockReturnValue(mock<ISettings>());
    }

    public CreateTestee() {
        return new PluginController(this.MockStorageController, this.MockSettingsManager);
    }

    private static CheckOriginRedirected(requestURL: string, responseURL: string): boolean {
        const requestOrigin = new URL(requestURL).origin;
        const responseOrigin = new URL(responseURL).origin;
        const patterns = expectedOriginRedirectPatterns.get(requestOrigin);
        if(patterns) {
            return !(patterns.some(pattern => pattern.test(responseOrigin)));
        } else {
            return requestOrigin !== responseOrigin;
        }
    }

    public static async GetStatus(uri: URL) {
        const result = { code: StatusCode.ERROR, info: 'Not Processed' };
        try {
            const request = new Request(uri, { signal: AbortSignal.timeout(30_000) });
            const response = await fetch(request);
            if(this.CheckOriginRedirected(request.url, response.url)) {
                result.code = StatusCode.WARNING;
                result.info = 'Redirected: ' + response.url;
            } else {
                result.code = StatusCode.OK;
                result.info = '';
            }
        } catch(error) {
            result.code = StatusCode.ERROR;
            result.info = `${error.cause ?? error.message ?? error}`;
        } finally {
            return result;
        }
    }

    public static async GetSimilarWeb(uri: URL) {

        // TODO: Bypass RateLimit and IP-ban for SimilarWeb API
        return { rank: Number.POSITIVE_INFINITY, visitors: 0 };
        /*
        const result = { rank: Number.POSITIVE_INFINITY, visitors: 0 };
        try {
            const request = new Request(`https://data.similarweb.com/api/v1/data?domain=${uri.hostname}`);
            const response = await fetch(request);
            if(response.status === 200) {
                const data: SimilarWebData = await response.json();
                result.rank = data.GlobalRank.Rank ?? result.rank;
                result.visitors = Object.values(data.EstimatedMonthlyVisits).at(-1) ?? result.visitors;
            } else {
                console.warn('SimilarWeb API', response.status);
                await new Promise(resolve => setTimeout(resolve, 7500));
            }
        } catch {}
        finally {
            return result;
        }
        */
    }

    // TODO: Improve composition of HTML report
    public static async GenerateReport(results: Result[]) {
    
        const directory = path.join('web', 'scripts', 'cache');
    
        const emojis = new Map([
            [ StatusCode.OK, '✅' ],
            [ StatusCode.WARNING, '⚠️' ],
            [ StatusCode.ERROR, '❌' ],
        ]);
    
        function sort(self: Result, other: Result) {
            // First Priority
            if(self.status.code !== other.status.code) {
                return self.status.code - other.status.code;
            }
            // Second Priority
            if(self.visitors !== other.visitors) {
                return other.visitors - self.visitors;
            }
            // Last Priority
            return self.title.localeCompare(other.title, 'en', { sensitivity: 'base', caseFirst: 'lower', numeric: true });
        }

        const max = results.reduce((max, result) => Math.max(max, result.visitors), 0);
        const head = `
            <thead style="background-color: lightgray;">
                <tr>
                    <th width="1">Status</th>
                    <th width="1">Website</th>
                    <th>Estimated Popularity (by <a href="https://www.similarweb.com/top-websites/arts-and-entertainment/animation-and-comics/" target="_blank">SimilarWeb</a>)</th>
                </tr>
            </thead>
        `;
        const rows = [...results].sort(sort).map(result => {
            return `
                <tr>
                    <td style="white-space: nowrap; cursor: context-menu;" title="${result.status.info}">${emojis.get(result.status.code) ?? 'ℹ️'}</td>
                    <td style="white-space: nowrap;"><a href="${result.url}" target="_blank">${result.title}</a></td>
                    <td><progress value="${result.visitors}" max="${max}" style="width: 100%;"></progress></td>
                </tr>
            `;
        }).join('');

        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(path.join(directory, 'website-metrics.json'), JSON.stringify(results, null, 2));
        await fs.writeFile(path.join(directory, 'website-metrics.html'), `<table width="100%" style="user-select: none;">${head}<tbody>${rows}</tbody></table>`);
    }
}

describe('Website Status/Metrics', { concurrent: true }, async () => {

    const results: Result[] = [];

    afterAll(async () => {
        await TestFixture.GenerateReport(results);
    });

    test.each(new TestFixture().CreateTestee().WebsitePlugins)('$Title ➔ $URI.href', { timeout: 60_000 }, async (plugin) => {
        const [ { code, info }, { rank, visitors } ] = await Promise.all([
            TestFixture.GetStatus(plugin.URI),
            TestFixture.GetSimilarWeb(plugin.URI),
        ]);
        const result = {
            id: plugin.Identifier,
            title: plugin.Title,
            url: plugin.URI.href,
            status: { code, info },
            visitors,
            rank,
        };

        results.push(result);

        expect(result.status).toSatisfy<typeof result.status>(status => status.code === StatusCode.OK, result.status.info);
    });
});