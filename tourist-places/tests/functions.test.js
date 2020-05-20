const { getDistHaversinusFormula } = require('../src/functions.js');
const { getWalkingDistance } = require('../src/functions.js');
const { getWalkingTime } = require('../src/functions.js');

test('algebraic operations 50.4605 and 50.4531 and 30.5148 and 30.5305 to equal 1.3826782884506175', () => {
    expect(getDistHaversinusFormula(50.4605, 50.4531, 30.5148, 30.5305)).toBe(1.3826782884506175);
});

test('multiply and round 1440 * 2 to equal 2880', () => {
    expect(getWalkingDistance(2)).toBe(2880);
});

test('multiply and round 0.015 * 450 to equal 7', () => {
    expect(getWalkingTime(450)).toBe(7);
});