import { Observable } from './Observable';

const category = 'hakuneko:flags';
const keyHideSplashScreen = `${category}:no-splash`;
const keyVerboseBackgroundFetchWindow = `${category}:verbose-fetchwindow`;
//const keyCrowdinTranslationMode = `${category}:crowdin-translation`;

/**
 * Provide flags for switching functionality that is not meant to be controlled by the end-user.
 */
export class FeatureFlags {

    public readonly HideSplashScreen = new Observable(false);
    public readonly VerboseFetchWindow = new Observable(false);
    //public readonly CrowdinTranslationMode = new Observable(false);

    public Initialize(): FeatureFlags {

        this.HideSplashScreen.Value = window.localStorage.getItem(keyHideSplashScreen) === 'true';
        this.HideSplashScreen.Subscribe(value => window.localStorage.setItem(keyHideSplashScreen, value ? 'true' : 'false'));

        this.VerboseFetchWindow.Value = window.localStorage.getItem(keyVerboseBackgroundFetchWindow) === 'true';
        this.VerboseFetchWindow.Subscribe(value => window.localStorage.setItem(keyVerboseBackgroundFetchWindow, value ? 'true' : 'false'));

        //this.CrowdinTranslationMode.Value = window.localStorage.getItem(keyCrowdinTranslationMode) === 'true';
        //this.CrowdinTranslationMode.Subscribe(value => window.localStorage.setItem(keyCrowdinTranslationMode, value ? 'true' : 'false'));

        return this;
    }
}