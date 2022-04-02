export class RequestRateLimit {

    public static readonly Unlimited = new RequestRateLimit(0, 0);

    /**
     * 
     * @param RequestCount Maximum number of requests within the given {@link TimeSpan}.
     * @param TimeSpan Time range [sec] related to the given {@link RequestCount}.
     */
    constructor(public RequestCount: number, public TimeSpan: number = 1) {
    }

    /**
     * The minimal calculated delay [ms] between requests to comply with the rate limit.
     */
    public get Throttle() {
        return this.RequestCount > 0 && this.TimeSpan > 0 ? (this.TimeSpan * 1000 / this.RequestCount) : 0;
    }
}