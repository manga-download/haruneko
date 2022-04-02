export class RateLimit {

    /**
     * Create a new {@link RateLimit} instance.
     * @param amount Maximum number of units within the given {@link interval}.
     * @param interval Related timespan [sec] for the given {@link amount}.
     */
    constructor(private readonly amount: number, private readonly interval: number = 1) {
    }

    /**
     * The minimal calculated delay [ms] between requests to comply with the rate limit.
     */
    public get Throttle() {
        return this.amount > 0 && this.interval > 0 ? (this.interval * 1000 / this.amount) : 0;
    }
}

export const Unlimited = new RateLimit(0, 0);