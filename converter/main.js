const smallestExponentNormalized = -16382;
const largestExponentNormalized = 16383;
const biasForEPrime = 16383;

// E' representation 

// s, e' = 0, f = 0           0
// s, e' = 0, f != 0          Denormalized
// s, e' = 16383, f = 0       infinity
// s, e' = 16383, f != 0      NaN


// positive normal number is +1.0 x 2^denormalizedExponent
// smallest-magnitude negative normal number is -1.0 x 2^denormalizedExponent
const getExcess = (base) => {
  return parseInt(base) + parseInt(biasForEPrime);
};

const getBinary = (decimal) => {
  let binary = decimal.toString(2);
  return binary;
};

const getHex = (binaryDigits) => {
  console.log(binaryDigits);
  let decimal = parseInt(binaryDigits, 2);
  let hex = decimal.toString(16);
  return hex.toUpperCase();
};

const getRemainingDigits = (binaryInput) => {
  let result = "";
  result = binaryInput.toString().substring(2);
  return result;
};

const completeSignificand = (remainingDigits) => {
  while (remainingDigits.length != 112) {
    remainingDigits += "0";
  }
  return remainingDigits;
};


document.getElementById('formSelector').addEventListener('change', function() {
  let selectedForm = this.value;
  let binaryForm = document.getElementById('binaryForm');
  let decimalForm = document.getElementById('decimalForm');

  if (selectedForm === 'binary') {
      binaryForm.classList.remove('hidden');
      decimalForm.classList.add('hidden');
  } else if (selectedForm === 'decimal') {
      binaryForm.classList.add('hidden');
      decimalForm.classList.remove('hidden');
  }
});

const validateDecimal = (input) => {
  return /^-?\d+(\.\d+)?$/.test(input);
}

const validateBinary = (input) => {
  return /^[01]+(\.[01]+)?$/.test(input) && (input.match(/\./g) || []).length <= 1;
}


document.querySelector("#submit").addEventListener("click", function (e) {
  e.preventDefault();
  
  let selectedForm = document.getElementById('formSelector').value;
  let binaryInput, baseInput;
  
  if (selectedForm === 'binary') {
    binaryInput = document.querySelector("#binary").value;
    if (!validateBinary(binaryInput)) {
        alert("Invalid binary input");
        return; // Exit the function early
    }
    baseInput = parseInt(document.querySelector("#base-2").value);
} else if (selectedForm === 'decimal') {
    let decimalInput = parseFloat(document.querySelector("#decimal").value);
    if (!validateDecimal(decimalInput)) {
        alert("Invalid decimal input");
        return; // Exit the function early
    }
    binaryInput = getBinary(decimalInput); // Convert decimal to binary
    baseInput = 0; // Base is always 0 for binary input in this context
}
  
  // declare the binary digits
  let binaryDigits = "";
  let signBit = "";
  // append the sign bit
  if (binaryInput < 0) {
    signBit = "1";
    binaryInput *= -1; // make input positive
  } else {
    signBit = "0";
  }
  binaryDigits += signBit;

  // normalize the binary input
 if (binaryInput > 1) {
    while (Math.floor(binaryInput) != 1) {
      binaryInput /= 10;
      baseInput += 1;
    }
  } else if (binaryInput < 1 && binaryInput > 0) {
    while (Math.floor(binaryInput) != 1) {
      binaryInput *= 10;
      baseInput -= 1;
    }
  } else {
    // baseInput and binaryinput remains the same
  }

  // get the excess
  let excess = getExcess(baseInput);

  // get the binary value of excess and append
  let exponent = getBinary(excess);
  binaryDigits = binaryDigits + exponent;

  // get the remaining digits
  let remainingDigits = getRemainingDigits(binaryInput);

  // add zeroes to binary if not complete
  let significand = completeSignificand(remainingDigits);
  binaryDigits = binaryDigits + significand;

  // get hex value
  let hexOutput = getHex(binaryDigits);

  // assign to output element
  document.querySelector("#hexOutput").innerHTML = hexOutput;
  document.querySelector("#signBit").innerHTML = signBit;
  document.querySelector("#exponent").innerHTML = exponent;
  document.querySelector("#significand").innerHTML = significand;

 
});
