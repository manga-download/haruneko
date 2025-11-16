import puppeteer, { type Browser, type Page } from 'puppeteer';
import { JSDOM, VirtualConsole } from 'jsdom';
import { FetchProvider, type ScriptInjection } from './FetchProviderCommon.js';
import { config } from '../../config/settings.js';
import { logger } from '../../config/logger.js';
import { CheckAntiScrapingDetection, FetchRedirection } from './AntiScrapingDetection.js';

/**
 * Puppeteer-based fetch provider for server-side environments
 * Replaces NW.js/Electron browser windows for Cloudflare handling
 */
export class FetchProviderPuppeteer extends FetchProvider {
    private browser: Browser | null = null;
    private browserPool: Page[] = [];
    private readonly maxBrowsers = config.puppeteer.maxBrowsers;

    /**
     * Initialize browser instance
     */
    private async getBrowser(): Promise<Browser> {
        if (!this.browser || !this.browser.connected) {
            try {
                logger.info('🌐 Launching Puppeteer browser...');
                this.browser = await puppeteer.launch({
                    headless: config.puppeteer.headless,
                    executablePath: config.puppeteer.executablePath,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-gpu',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-extensions',
                    ],
                });
                logger.info('✅ Puppeteer browser launched');
            } catch (error) {
                logger.error('❌ Failed to launch Puppeteer browser:', error);
                logger.error('💡 Solution: Install Chromium/Chrome or set PUPPETEER_EXECUTABLE_PATH');
                logger.error('📖 See PUPPETEER_SETUP.md for detailed instructions');
                throw new Error(
                    'Failed to launch browser. Please install Chromium/Chrome or set PUPPETEER_EXECUTABLE_PATH environment variable. See PUPPETEER_SETUP.md for instructions.'
                );
            }
        }
        return this.browser;
    }

    /**
     * Get a page from the pool or create a new one
     */
    private async getPage(): Promise<Page> {
        // Try to get an available page from the pool
        const availablePage = this.browserPool.pop();
        if (availablePage) {
            return availablePage;
        }

        // Create new page if under limit
        if (this.browserPool.length < this.maxBrowsers) {
            const browser = await this.getBrowser();
            const page = await browser.newPage();

            // Set realistic viewport and user agent
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
            );

            return page;
        }

        // Wait and retry if pool is full
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getPage();
    }

    /**
     * Return page to pool
     */
    private async releasePage(page: Page): Promise<void> {
        try {
            // Clear cookies and cache
            await page.evaluate(() => {
                localStorage.clear();
                sessionStorage.clear();
            });

            if (this.browserPool.length < this.maxBrowsers) {
                this.browserPool.push(page);
            } else {
                await page.close();
            }
        } catch (error) {
            logger.error('Error releasing page:', error);
            await page.close().catch(() => {});
        }
    }

    /**
     * Standard fetch implementation
     */
    public async Fetch(request: Request): Promise<Response> {
        // Try standard fetch first
        try {
            const response = await fetch(request);
            await this.ValidateResponse(response);
            return response;
        } catch (error) {
            // If Cloudflare challenge detected, use Puppeteer
            if (error.message?.includes('CloudFlare') || error.message?.includes('Forbidden')) {
                logger.warn(`Cloudflare detected for ${request.url}, using Puppeteer...`);
                return this.FetchWithBrowser(request);
            }
            throw error;
        }
    }

    /**
     * Fetch using Puppeteer browser
     */
    private async FetchWithBrowser(request: Request): Promise<Response> {
        const page = await this.getPage();

        try {
            const response = await page.goto(request.url, {
                waitUntil: 'domcontentloaded',
                timeout: config.puppeteer.timeout,
            });

            if (!response) {
                throw new Error(`Failed to load ${request.url}`);
            }

            // Wait for Cloudflare challenge to complete
            await this.waitForCloudflare(page);

            const content = await page.content();
            const headers = response.headers();

            const responseInit: ResponseInit = {
                status: response.status(),
                statusText: response.statusText(),
                headers: new Headers(headers as HeadersInit),
            };

            return new Response(content, responseInit);
        } finally {
            await this.releasePage(page);
        }
    }

    /**
     * Wait for Cloudflare challenge to complete
     */
    private async waitForCloudflare(page: Page, maxWaitTime = 30000): Promise<void> {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            const isChallengePresent = await page.evaluate(() => {
                // Check for common Cloudflare challenge indicators
                return (
                    document.title.toLowerCase().includes('just a moment') ||
                    document.title.toLowerCase().includes('checking your browser') ||
                    !!document.querySelector('#challenge-running') ||
                    !!document.querySelector('.cf-browser-verification') ||
                    !!document.querySelector('div[class*="cloudflare"]')
                );
            });

            if (!isChallengePresent) {
                logger.info('Cloudflare challenge passed');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        logger.warn('Cloudflare challenge timeout, proceeding anyway...');
    }

    /**
     * Fetch and parse HTML using JSDOM
     */
    public override async FetchHTML(request: Request): Promise<Document> {
        const response = await this.Fetch(request);
        const html = await response.text();

        // Create a virtual console that suppresses CSS parsing errors
        // This prevents malformed CSS on manga pages from breaking the download process
        const virtualConsole = new VirtualConsole();
        virtualConsole.on('error', (error) => {
            // Suppress CSS parsing errors but log other errors
            if (!error.message?.includes('Could not parse CSS') && !error.message?.includes('not found')) {
                logger.error('JSDOM error:', error);
            }
        });

        // Use JSDOM to create a DOM
        const dom = new JSDOM(html, {
            url: request.url,
            contentType: 'text/html',
            virtualConsole,
        });

        return dom.window.document;
    }

    /**
     * Execute script in browser window (replaces FetchWindowScript)
     */
    public override async FetchWindowScript<T extends void | JSONElement>(
        request: Request,
        script: ScriptInjection<T>,
        delay = 0,
        timeout = 60000
    ): Promise<T> {
        return this.FetchWindowPreloadScript<T>(request, () => undefined, script, delay, timeout);
    }

    /**
     * Execute script in browser window with preload script
     */
    public override async FetchWindowPreloadScript<T extends void | JSONElement>(
        request: Request,
        preload: ScriptInjection<void>,
        script: ScriptInjection<T>,
        delay = 0,
        timeout = 60000
    ): Promise<T> {
        const page = await this.getPage();

        try {
            // Evaluate preload script
            if (preload) {
                await page.evaluateOnNewDocument(preload as () => void);
            }

            // Navigate to URL
            const response = await page.goto(request.url, {
                waitUntil: 'domcontentloaded',
                timeout,
            });

            if (!response) {
                throw new Error(`Failed to load ${request.url}`);
            }

            // Check for anti-scraping
            const hasChallenge = await page.evaluate(() => {
                return (
                    document.title.toLowerCase().includes('just a moment') ||
                    document.title.toLowerCase().includes('checking your browser') ||
                    !!document.querySelector('form[name="fcaptcha"]') ||
                    !!document.querySelector('#challenge-running')
                );
            });

            if (hasChallenge) {
                logger.warn(`Anti-scraping challenge detected for ${request.url}`);
                // Wait for challenge to complete
                await this.waitForCloudflare(page, timeout);
            }

            // Wait for delay
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Execute main script
            const result = await page.evaluate(script as () => Promise<T>);

            return result;
        } finally {
            await this.releasePage(page);
        }
    }

    /**
     * Cleanup browser resources
     */
    public async cleanup(): Promise<void> {
        logger.info('🧹 Cleaning up Puppeteer resources...');

        // Close all pages in pool
        await Promise.all(this.browserPool.map(page => page.close().catch(() => {})));
        this.browserPool = [];

        // Close browser
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }

        logger.info('✅ Puppeteer cleanup complete');
    }
}
