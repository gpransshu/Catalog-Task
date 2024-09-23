const fs = require('fs');

// Function to decode values based on base
function decodeValue(base, value) {
    return parseInt(value, base);  // Convert the value from given base to decimal
}

// Lagrange interpolation function to calculate the constant term c
function lagrangeInterpolation(points) {
    let c = 0;
    
    for (let i = 0; i < points.length; i++) {
        let [xi, yi] = points[i];
        let li = 1;
        
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let [xj, _] = points[j];
                li *= (0 - xj) / (xi - xj);  // Interpolation formula
            }
        }
        c += yi * li;  // Sum up the terms
    }
    return c;
}

// Main function to read JSON input and solve for c
function findSecretC(jsonFilePath) {
    // Read JSON data
    let data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // Extract the number of roots and required roots (k = m + 1)
    let n = data.keys.n;
    let k = data.keys.k;
    
    // Collect the points (x, y) where y values are decoded from their respective bases
    let points = [];
    for (let key in data) {
        if (key !== 'keys') {  // Skip the 'keys' object
            let x = parseInt(key, 10);  // x is the key index (convert key string to number)
            let base = parseInt(data[key].base, 10);
            let y = decodeValue(base, data[key].value);  // Decode y based on the provided base
            points.push([x, y]);
        }
    }
    
    // Ensure we have enough points to solve the polynomial (m + 1 = k)
    if (points.length < k) {
        console.log('Not enough points to solve the polynomial.');
        return;
    }
    
    // Calculate the constant term 'c' using Lagrange Interpolation
    let constantTerm = lagrangeInterpolation(points.slice(0, k));  // Take the first k points
    console.log(`The constant term (c) of the polynomial is: ${constantTerm}`);
}

// Example usage
findSecretC('input.json');
findSecretC('input1.json');
