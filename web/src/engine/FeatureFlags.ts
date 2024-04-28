import { Observable } from './Observable';
import { FrontendController } from '../frontend/FrontendController';

const category = 'hakuneko:flags';

enum Key {
    HideSplashScreen = `${category}:no-splash`,
    VerboseFetchWindow = `${category}:verbose-fetchwindow`,
    CrowdinTranslationMode = `${category}:crowdin-translation`,
}

/**
 * Provide flags for switching functionality that is not meant to be controlled by the end-user.
 */
export class FeatureFlags {

    public readonly HideSplashScreen = new Observable(false);
    public readonly VerboseFetchWindow = new Observable(false);
    public readonly CrowdinTranslationMode = new Observable(false);

    public Initialize(): FeatureFlags {
        this.Register(this.HideSplashScreen, Key.HideSplashScreen);
        this.Register(this.VerboseFetchWindow, Key.VerboseFetchWindow);
        this.Register(this.CrowdinTranslationMode, Key.CrowdinTranslationMode);
        this.CrowdinTranslationMode.Subscribe(FrontendController.RequestReload);
        return this;
    }

    private Register(observable: Observable<boolean, null>, key: Key) {
        observable.Value = window.localStorage.getItem(key) === 'true';
        observable.Subscribe(value => window.localStorage.setItem(key, value ? 'true' : 'false'));
    }
}