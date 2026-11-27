#!/usr/bin/env node
/**
 * Calculadora CLI em Node.js.
 *
 * Operações suportadas:
 *   - add       (adição, +)
 *   - subtract  (subtração, -)
 *   - multiply  (multiplicação, ×)
 *   - divide    (divisão, ÷; erro em caso de divisão por zero)
 *   - modulo    (resto da divisão, %; erro em caso de divisor zero)
 *   - power     (exponenciação)
 *   - sqrt      (raiz quadrada; erro para números negativos)
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *   node src/calculator.js add 2 3        # 5
 *   node src/calculator.js subtract 5 2   # 3
 *   node src/calculator.js multiply 4 3   # 12
 *   node src/calculator.js divide 10 2    # 5
 *   node src/calculator.js modulo 10 3    # 1
 *   node src/calculator.js power 2 8      # 256
 *   node src/calculator.js sqrt 16        # 4
 */

// Adição: a + b
function addition(a, b) {
  return a + b;
}

// Subtração: a - b
function subtraction(a, b) {
  return a - b;
}

// Multiplicação: a × b
function multiplication(a, b) {
  return a * b;
}

// Divisão: a ÷ b (lança erro se b for zero)
function division(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero não é permitida.');
  }
  return a / b;
}

// Módulo: resto de a ÷ b (lança erro se b for zero)
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Módulo por zero não é permitido.');
  }
  return a % b;
}

// Potência: base elevada a exponent
function power(base, exponent) {
  return Math.pow(base, exponent);
}

// Raiz quadrada de n (lança erro se n for negativo)
function squareRoot(n) {
  if (n < 0) {
    throw new Error('Raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(n);
}

const operations = {
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
  modulo,
  power,
  sqrt: squareRoot,
};

const unaryOperations = new Set(['sqrt']);

function main(args) {
  const [operation, rawA, rawB] = args;
  const usage =
    'Uso: node src/calculator.js <add|subtract|multiply|divide|modulo|power> <a> <b> | sqrt <n>';
  const unary = unaryOperations.has(operation);

  if (!operation || rawA === undefined || (!unary && rawB === undefined)) {
    throw new Error(`Argumentos ausentes. ${usage}`);
  }
  if (!Object.hasOwn(operations, operation)) {
    throw new Error(`Operação inválida: "${operation}". ${usage}`);
  }

  const a = Number(rawA);
  const b = unary ? 0 : Number(rawB);
  if (rawA.trim() === '' || (!unary && rawB.trim() === '') || Number.isNaN(a) || Number.isNaN(b)) {
    throw new Error('Os operandos devem ser números válidos.');
  }

  return operations[operation](a, b);
}

if (require.main === module) {
  try {
    console.log(main(process.argv.slice(2)));
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { addition, subtraction, multiplication, division, modulo, power, squareRoot };
