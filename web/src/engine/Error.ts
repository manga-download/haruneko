import type { IResource } from '../i18n/ILocale';
import { GetLocale } from '../i18n/Localization';

/**
 * An internal error should be raised when caused by broken programming logic (software bug).
 * Internal errors are not expected to be presented to the user and therefore do not need to be localized.
 */
export class InternalError extends Error {
    public override get name(): string {
        return this.constructor.name;
    }
}

/**
 * An error indicating that a certain programming logic is intentionally missing.
 */
export /* sealed */ class NotImplementedError extends InternalError {
    public override get name(): string {
        return "NotImplementedError";
    }
}

/**
 * An exception should be raised when a problem appears during runtime and should be properly handled at some point.
 * Exceptions are expected to be presented to the user and therefore must be localized.
 */
export class Exception extends Error {

    private readonly params: string[];

    constructor(private readonly key: keyof IResource, ...params: string[]) {
        super();
        this.params = params;
    }

    public override get name(): string {
        return `${this.constructor.name}<${this.key}>`;
    }

    public override get message(): string {
        return GetLocale()[this.key](...this.params);
    }
}