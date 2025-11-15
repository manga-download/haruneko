export class RateLimit {

    /**
     * Create a new {@link RateLimit} instance.
     * @param amount - Maximum number of units within the given {@link interval}.
     * @param interval - Related timespan [sec] for the given {@link amount}.
     */
    constructor(private readonly amount: number, private readonly interval: number = 1) {
    }

    /**
     * The minimal cycle time [ms] between each unit to prevent exceeding the given {@link amount} per {@link interval},
     * e.g. a rate limit of 5 units per 1 second would require throttling of at least 200 milliseconds per unit.
     */
    public get Throttle() {
        return this.amount > 0 && this.interval > 0 ? this.interval * 1000 / this.amount : 0;
    }

    /**
     * Create a new {@link RateLimit} instance.
     * @param amount - Maximum number of units within an interval of 60 seconds.
     */
    public static PerMinute(amount: number) {
        return new RateLimit(amount, 60);
    }
}

export const Unlimited = new RateLimit(0, 0);