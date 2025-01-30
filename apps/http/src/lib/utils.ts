export function generateSessionId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Helper function to generate a random string of 3 characters
    function generateSegment() {
        return Array.from({ length: 3 }, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');
    }
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}