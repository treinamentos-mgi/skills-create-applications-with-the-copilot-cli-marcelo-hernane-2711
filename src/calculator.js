#!/usr/bin/env node
/**
 * Calculadora CLI em Node.js.
 *
 * Operações suportadas:
 *   - add       (adição, +)
 *   - subtract  (subtração, -)
 *   - multiply  (multiplicação, ×)
 *   - divide    (divisão, ÷; erro em caso de divisão por zero)
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *   node src/calculator.js add 2 3        # 5
 *   node src/calculator.js subtract 5 2   # 3
 *   node src/calculator.js multiply 4 3   # 12
 *   node src/calculator.js divide 10 2    # 5
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

const operations = {
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
};

function main(args) {
  const [operation, rawA, rawB] = args;
  const usage = 'Uso: node src/calculator.js <add|subtract|multiply|divide> <a> <b>';

  if (!operation || rawA === undefined || rawB === undefined) {
    throw new Error(`Argumentos ausentes. ${usage}`);
  }
  if (!Object.hasOwn(operations, operation)) {
    throw new Error(`Operação inválida: "${operation}". ${usage}`);
  }

  const a = Number(rawA);
  const b = Number(rawB);
  if (rawA.trim() === '' || rawB.trim() === '' || Number.isNaN(a) || Number.isNaN(b)) {
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

module.exports = { addition, subtraction, multiplication, division };
