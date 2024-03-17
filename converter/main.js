const EXPONENT_MAX_VALUE = "1".repeat(15);
const EXPONENT_MIN_VALUE = "0".repeat(15);
const SIGNIFICAND_ZERO = "0".repeat(112);

const getExcess = (base) => {
  return parseInt(base) + parseInt(biasForEPrime);
};

const getBinary = (decimal) => {
  let binary = decimal.toString(2);
  return binary;
};

const getHex = (binaryDigits) => {
  let decimal = parseInt(binaryDigits, 2);
  let hex = decimal.toString(16);
  return hex.toUpperCase();
};

const getRemainingDigits = (binaryInput) => {
  let result = binaryInput.toString().substring(2);
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
        return;
    }
    baseInput = parseInt(document.querySelector("#base-2").value);
  } else if (selectedForm === 'decimal') {
    let decimalInput = parseFloat(document.querySelector("#decimal").value);
    if (!validateDecimal(decimalInput)) {
        alert("Invalid decimal input");
        return;
    }
    baseInput = parseInt(document.querySelector("#base-10").value);
    decimalInput *= Math.pow(10, baseInput);
    binaryInput = getBinary(decimalInput);
    baseInput = 0;
  }
  
  let binaryDigits = "";
  let signBit = "";
  let hexOutput, excess, exponent, significand, remainingDigits;

  if (binaryInput < 0) {
    signBit = "1";
    binaryInput *= -1;
  } else {
    signBit = "0";
  }
  binaryDigits += signBit;

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
  }

  const isPositiveInfinity = (binaryInput) => {
    const exponentBits = binaryInput.substring(1, 16);
    const significandBits = binaryInput.substring(16);
    return exponentBits === EXPONENT_MAX_VALUE && significandBits === SIGNIFICAND_ZERO;
  };

  const isNegativeInfinity = (binaryInput) => {
    return binaryInput[0] === "1" && isPositiveInfinity(binaryInput.substring(1));
  };

  const isDenormalized = (binaryInput) => {
    const exponentBits = binaryInput.substring(1, 16);
    const significandBits = binaryInput.substring(16);
    return exponentBits === "0".repeat(15) && significandBits !== "0".repeat(112);
  };

  if(binaryInput != 0) {
    if (isPositiveInfinity(binaryInput)) {
      exponent = EXPONENT_MAX_VALUE;
      significand = SIGNIFICAND_ZERO;
    } else if (isNegativeInfinity(binaryInput)) {
      exponent = EXPONENT_MAX_VALUE;
      significand = SIGNIFICAND_ZERO;
    } else if (isDenormalized(binaryInput)) {
      exponent = EXPONENT_MIN_VALUE;
      significand = binaryInput.substring(16);
    } else {
      excess = getExcess(baseInput);
      exponent = getBinary(excess);
      remainingDigits = getRemainingDigits(binaryInput);
      significand = completeSignificand(remainingDigits);
    }
  } else {
    exponent = EXPONENT_MIN_VALUE;;
    remainingDigits = getRemainingDigits("0");
    significand = completeSignificand(remainingDigits);
  }

  hexOutput = getHex(binaryDigits + significand);
  document.querySelector("#hexOutput").innerHTML = hexOutput;
  document.querySelector("#signBit").innerHTML = signBit;
  document.querySelector("#exponent").innerHTML = exponent;
  document.querySelector("#significand").innerHTML = significand;
});
