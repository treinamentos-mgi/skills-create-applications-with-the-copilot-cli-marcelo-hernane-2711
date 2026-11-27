const { execFileSync, spawnSync } = require('child_process');
const path = require('path');
const { add, subtract, multiply, divide } = require('../calculator');

const CLI = path.join(__dirname, '..', 'calculator.js');

describe('add', () => {
  test('2 + 3 = 5', () => expect(add(2, 3)).toBe(5));
  test('números negativos', () => expect(add(-2, -3)).toBe(-5));
  test('positivo com negativo', () => expect(add(5, -8)).toBe(-3));
  test('zero é o elemento neutro', () => expect(add(7, 0)).toBe(7));
  test('decimais', () => expect(add(0.5, 0.25)).toBeCloseTo(0.75));
  test('0.1 + 0.2 ≈ 0.3', () => expect(add(0.1, 0.2)).toBeCloseTo(0.3));
  test('números grandes', () => expect(add(1e15, 1e15)).toBe(2e15));
});

describe('subtract', () => {
  test('10 - 4 = 6', () => expect(subtract(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtract(4, 10)).toBe(-6));
  test('subtrair negativo', () => expect(subtract(5, -3)).toBe(8));
  test('subtrair zero', () => expect(subtract(9, 0)).toBe(9));
  test('número menos ele mesmo', () => expect(subtract(3.5, 3.5)).toBe(0));
  test('decimais', () => expect(subtract(1.5, 0.5)).toBeCloseTo(1));
});

describe('multiply', () => {
  test('45 * 2 = 90', () => expect(multiply(45, 2)).toBe(90));
  test('multiplicar por zero', () => expect(multiply(123, 0)).toBe(0));
  test('multiplicar por um', () => expect(multiply(8, 1)).toBe(8));
  test('sinais diferentes', () => expect(multiply(-4, 3)).toBe(-12));
  test('dois negativos', () => expect(multiply(-4, -3)).toBe(12));
  test('decimais', () => expect(multiply(0.5, 0.5)).toBeCloseTo(0.25));
});

describe('divide', () => {
  test('20 / 5 = 4', () => expect(divide(20, 5)).toBe(4));
  test('resultado decimal', () => expect(divide(1, 4)).toBe(0.25));
  test('dividir por um', () => expect(divide(9, 1)).toBe(9));
  test('zero dividido por número', () => expect(divide(0, 5)).toBe(0));
  test('sinais diferentes', () => expect(divide(-10, 2)).toBe(-5));
  test('dois negativos', () => expect(divide(-10, -2)).toBe(5));
  test('divisão por zero lança erro', () => {
    expect(() => divide(10, 0)).toThrow('Divisão por zero');
  });
  test('0 / 0 lança erro', () => {
    expect(() => divide(0, 0)).toThrow('Divisão por zero');
  });
});

describe('CLI', () => {
  const run = (...args) => spawnSync('node', [CLI, ...args], { encoding: 'utf8' });

  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
  ])('%j imprime %s', (args, expected) => {
    expect(execFileSync('node', [CLI, ...args], { encoding: 'utf8' }).trim()).toBe(expected);
  });

  test('divisão por zero retorna erro e código 1', () => {
    const r = run('divide', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Divisão por zero');
  });

  test('operando não numérico', () => {
    const r = run('add', 'x', '1');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('números válidos');
  });

  test('argumentos ausentes', () => {
    const r = run('add', '1');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Argumentos ausentes');
  });

  test('operação inválida', () => {
    const r = run('power', '1', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Operação inválida');
  });
});
