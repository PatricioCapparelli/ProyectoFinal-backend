export const convertToBoolean = (value) => {
    const trueValues = [ "true", "on", "yes", "1", 1, true ];
    return trueValues.includes(value);
};