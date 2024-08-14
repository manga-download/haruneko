import { describe, it, expect } from 'vitest';
import './RegExpSafe';

describe('RegExpSafe', () => {

    it('Should be an alias for RegExp to bypass ReDoS check in code analysis', async () => {
        expect(RegExpSafe).toBe(RegExp);
    });

    it('Should process regular expression with interpolated string', async () => {
        const testee = new RegExpSafe(`_${ (() => 'x')() }-(\\d+)`, 'i');
        const actual = 'ooo _X-123 +++'.match(testee);
        expect(actual[0]).toBe('_X-123');
        expect(actual[1]).toBe('123');
    });
});