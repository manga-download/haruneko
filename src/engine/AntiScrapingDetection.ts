import { GetLocale } from "../i18n/Localization";

export enum FetchRedirection {
    None,
    Automatic,
    Interactive
}

type AntiScrapingDetection = (nwWindow: NWJS_Helpers.win) => Promise<FetchRedirection | undefined>;

const AntiScrapingDetections: AntiScrapingDetection[] = [
    CheckRedirect,
    CheckCloudFlare,
    CheckDDoSGuard
];

export async function AddAntiScrapingDetection(detection: AntiScrapingDetection) {
    AntiScrapingDetections.push(detection);
}

async function CheckRedirect(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection | undefined> {
    const dom = nwWindow.window.document;
    if(dom.querySelector('meta[http-equiv="refresh"][content*="="]')) {
        return FetchRedirection.Automatic;
    }
}

async function CheckCloudFlare(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection | undefined> {
    const dom = nwWindow.window.document;
    const cfCode = dom.querySelector('.cf-error-code');
    if(cfCode) {
        throw new Error(GetLocale().FetchProvider_FetchWindow_CloudFlareError(cfCode.textContent?.trim() || 'unknown'));
    }
    if(dom.querySelector('form#challenge-form[action*="_chl_jschl_"]')) { // __cf_chl_jschl_tk__
        return FetchRedirection.Automatic;
    }
    if(dom.querySelector('form#challenge-form[action*="_chl_f_"]')) { // __cf_chl_f_tk
        return FetchRedirection.Automatic;
    }
    if(dom.querySelector('form#challenge-form[action*="_captcha_"]')) { // __cf_chl_captcha_tk__
        return FetchRedirection.Interactive;
    }
}

async function CheckDDoSGuard(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection | undefined> {
    const dom = nwWindow.window.document;
    if(dom.querySelector('div#link-ddg a[href*="ddos-guard"]')) { // Sample => https://manga-tr.com
        await new Promise(resolve => setTimeout(resolve, 2500));
        return dom.querySelector('div#h-captcha') ? FetchRedirection.Interactive : FetchRedirection.Automatic;
    }
}

export async function CheckAntiScrapingDetection(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection> {

    for(const detect of AntiScrapingDetections) {
        const result = await detect(nwWindow);
        if(Object.values(FetchRedirection).includes(result)) {
            return result;
        }
    }

    return FetchRedirection.None;
}