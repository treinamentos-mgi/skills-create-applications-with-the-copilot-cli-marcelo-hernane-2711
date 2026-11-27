const { execFileSync, spawnSync } = require('child_process');
const path = require('path');
const { addition, subtraction, multiplication, division } = require('../calculator');

const CLI = path.join(__dirname, '..', 'calculator.js');

describe('addition', () => {
  test('2 + 3 = 5', () => expect(addition(2, 3)).toBe(5));
  test('números negativos', () => expect(addition(-2, -3)).toBe(-5));
  test('positivo com negativo', () => expect(addition(5, -8)).toBe(-3));
  test('zero é o elemento neutro', () => expect(addition(7, 0)).toBe(7));
  test('decimais', () => expect(addition(0.5, 0.25)).toBeCloseTo(0.75));
  test('0.1 + 0.2 ≈ 0.3', () => expect(addition(0.1, 0.2)).toBeCloseTo(0.3));
  test('números grandes', () => expect(addition(1e15, 1e15)).toBe(2e15));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(subtraction(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtraction(4, 10)).toBe(-6));
  test('subtrair negativo', () => expect(subtraction(5, -3)).toBe(8));
  test('subtrair zero', () => expect(subtraction(9, 0)).toBe(9));
  test('número menos ele mesmo', () => expect(subtraction(3.5, 3.5)).toBe(0));
  test('decimais', () => expect(subtraction(1.5, 0.5)).toBeCloseTo(1));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(multiplication(45, 2)).toBe(90));
  test('multiplicar por zero', () => expect(multiplication(123, 0)).toBe(0));
  test('multiplicar por um', () => expect(multiplication(8, 1)).toBe(8));
  test('sinais diferentes', () => expect(multiplication(-4, 3)).toBe(-12));
  test('dois negativos', () => expect(multiplication(-4, -3)).toBe(12));
  test('decimais', () => expect(multiplication(0.5, 0.5)).toBeCloseTo(0.25));
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(division(20, 5)).toBe(4));
  test('resultado decimal', () => expect(division(1, 4)).toBe(0.25));
  test('dividir por um', () => expect(division(9, 1)).toBe(9));
  test('zero dividido por número', () => expect(division(0, 5)).toBe(0));
  test('sinais diferentes', () => expect(division(-10, 2)).toBe(-5));
  test('dois negativos', () => expect(division(-10, -2)).toBe(5));
  test('divisão por zero lança erro', () => {
    expect(() => division(10, 0)).toThrow('Divisão por zero');
  });
  test('0 / 0 lança erro', () => {
    expect(() => division(0, 0)).toThrow('Divisão por zero');
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
