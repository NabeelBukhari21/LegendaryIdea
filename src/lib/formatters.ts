/**
 * Global Formatting Utilities
 * Enforces clean, judge-ready number formatting across the entire app.
 * Resolves ugly decimal overflows and inconsistent data displays.
 */

/**
 * Formats a fraction (e.g., 0.85) into a clean percentage string (e.g., "85%").
 * Never shows decimals unless absolutely necessary, capped at 1.
 */
export function formatPercentage(value: number, includeSymbol = true): string {
    if (isNaN(value)) return "0" + (includeSymbol ? "%" : "");
    const percent = Math.round(value * 100);
    return percent.toString() + (includeSymbol ? "%" : "");
}

/**
 * Formats a value that is ALREADY 0-100 (e.g. 85.7381) into a clean percentage string.
 */
export function formatPercentValue(value: number, includeSymbol = true): string {
    if (isNaN(value)) return "0" + (includeSymbol ? "%" : "");
    const rounded = Math.round(value);
    return rounded.toString() + (includeSymbol ? "%" : "");
}

/**
 * Formats raw confidence scores (0-1) into an integer score (0-100).
 */
export function formatScore(value: number): number {
    if (isNaN(value)) return 0;
    return Math.round(value * 100);
}

/**
 * Formats duration in milliseconds into a clean MM:SS string.
 */
export function formatDuration(ms: number): string {
    if (isNaN(ms) || ms < 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a raw number to a maximum of 1 decimal place, stripping trailing zeros.
 */
export function formatDecimal(value: number): string {
    if (isNaN(value)) return "0";
    const rounded = Math.round(value * 10) / 10;
    return rounded.toString();
}

/**
 * Formats counts cleanly (e.g., 1000 -> 1,000)
 */
export function formatCount(value: number): string {
    if (isNaN(value)) return "0";
    return Math.round(value).toLocaleString();
}
