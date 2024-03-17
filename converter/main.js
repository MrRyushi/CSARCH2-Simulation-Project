const smallestExponentNormalized = -16382;
const largestExponentNormalized = 16383;
const biasForEPrime = 16383;
const maxInfinity = 1.0 * Math.pow(2, 16383);
const minInfinity = -1.0 * Math.pow(2, 16383);
console.log(maxInfinity);

// E' representation 

// s, e' = 0, f = 0           0
// s, e' = 0, f != 0          Denormalized
// s, e' = 16383, f = 0       infinity
// s, e' = 16383, f != 0      NaN


// positive normal number is +1.0 x 2^denormalizedExponent
// smallest-magnitude negative normal number is -1.0 x 2^denormalizedExponent
const getExcess = (base) => {
  return parseInt(base) + 16383;
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
    let baseInput = parseInt(document.querySelector("#base-10").value); // Get the base input

        // Adjust the decimal input according to the base input
        decimalInput *= Math.pow(10, baseInput);
        // Convert the adjusted decimal input to binary
        binaryInput = getBinary(decimalInput);

    // Reset the base input to 0 since it's always 10
    baseInput = 0;
}
  
  // declare the binary digits
  let binaryDigits = "";
  let signBit = "";
  let hexOutput, excess, exponent, significand, remainingDigits;
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

  // Zero special case
  if(binaryInput != 0) {
     // get the excess
    excess = getExcess(baseInput);

     // get the binary value of excess and append
    exponent = getBinary(excess);
    binaryDigits = binaryDigits + exponent;
 
     // get the remaining digits
    remainingDigits = getRemainingDigits(binaryInput);
 
     // add zeroes to binary if not complete
    significand = completeSignificand(remainingDigits);
    binaryDigits = binaryDigits + significand;
 
     // get hex value
    hexOutput = getHex(binaryDigits);
    
  } else {
     // get the binary value of excess and append
    exponent = "000000000000000"
    binaryDigits = binaryDigits + exponent;
 
     // get the remaining digits
    remainingDigits = getRemainingDigits("0");
 
     // add zeroes to binary if not complete
    significand = completeSignificand(remainingDigits);
    binaryDigits = binaryDigits + significand;
 
     // get hex value
    hexOutput = getHex(binaryDigits);
  }

 



  // assign to output element
  document.querySelector("#hexOutput").innerHTML = hexOutput;
  document.querySelector("#signBit").innerHTML = signBit;
  document.querySelector("#exponent").innerHTML = exponent;
  document.querySelector("#significand").innerHTML = significand;

 
});
