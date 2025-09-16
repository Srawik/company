const fs = require('fs');

function solvePolynomialAssignment(input) {
    const n = input.keys.n;
    const k = input.keys.k;
    const roots = [];

    // Step 1: Convert base values to decimal and collect first k roots
    for (let i = 1; i <= n; i++) {
        const root = input[i.toString()];
        if (root) {
            const base = parseInt(root.base);
            const valueStr = root.value;

            // Convert value to decimal using BigInt
            const decimalValue = BigInt(parseInt(valueStr, base)).toString();

            roots.push({
                index: i,
                base: root.base,
                value: root.value,
                decimalValue: decimalValue
            });
        }
    }

    // Step 2: Solve for coefficients
    const A = [];
    const b = [];
    for (let i = 0; i < k; i++) {
        const x = BigInt(i + 1);  // x = 1, 2, ..., k
        const row = [];
        for (let power = k - 1; power >= 0; power--) {
            row.push(x ** BigInt(power));
        }
        A.push(row);
        b.push(BigInt(roots[i].decimalValue));
    }

    // Gaussian elimination using BigInt
    const coefficients = gaussianElimination(A, b);

    console.log("Polynomial coefficients (from highest degree to constant):");
    console.log(coefficients.map(c => c.toString()));

    // Step 3: Prepare the k-th root output
    const kthRoot = input[k.toString()];
    const output = {};
    output[k.toString()] = {
        base: kthRoot.base,
        value: kthRoot.value
    };

    return output;
}

function gaussianElimination(A, b) {
    const n = A.length;

    for (let i = 0; i < n; i++) {
        // Make diagonal element 1
        const inv = A[i][i];
        for (let j = i; j < n; j++) {
            A[i][j] /= inv;
        }
        b[i] /= inv;

        // Eliminate other rows
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = A[k][i];
                for (let j = i; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
                b[k] -= factor * b[i];
            }
        }
    }
    return b;
}

// Load input JSON file
const inputFile = process.argv[2];
const inputJSON = fs.readFileSync(inputFile, 'utf8');
const input = JSON.parse(inputJSON);

// Solve and output result
const output = solvePolynomialAssignment(input);
console.log("\nFinal Output:");
console.log(JSON.stringify(output, null, 4));