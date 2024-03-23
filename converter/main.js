const smallestExponentNormalized = -16382;
const largestExponentNormalized = 16383;

// const maxDenormalized = 1.0 * Math.pow(2, -16382);
// const minDenormalized = -1.0 * Math.pow(2, -16382);
// console.log(maxInfinity);

// E' representation 

// s, e' = 0, f = 0           0
// s, e' = 0, f != 0          Denormalized
// s, e' = 16383, f = 0       infinity
// s, e' = 16383, f != 0      NaN


// positive normal number is +1.0 x 2^denormalizedExponent
// smallest-magnitude negative normal number is -1.0 x 2^denormalizedExponent
const getExcess = (base) => {
    return parseInt(base) + parseInt(16383);
};

const getBinary = (decimal) => {
    let binary = decimal.toString(2);
    return binary;
};

const getHex = (binaryDigits) => {
    console.log(binaryDigits);
    let decimal = parseInt(binaryDigits, 2);
    let hex = decimal.toString(16).padStart(binaryDigits.length / 4, '0');
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
    // Allow an optional minus sign at the beginning, followed by digits and an optional decimal point
    return /^-?\d+(\.\d+)?$/.test(input);
}

const validateBinary = (input) => {
    // Allow an optional minus sign at the beginning, followed by binary digits and an optional decimal point
    return /^-?[01]+(\.[01]+)?$/.test(input) && (input.match(/\./g) || []).length <= 1;
}

// const getDenormalizedSignificand = (binaryInput) => {
//   // Convert binaryInput to string
//   binaryInput = binaryInput.toString();
//   // If the input is negative, remove the minus sign
//   binaryInput = binaryInput.replace('-', '');
//   // Split the binary input into integer and fractional parts
//   let parts = binaryInput.split('.');
//   // If there is no fractional part, return an empty string
//   if (parts.length === 1) {
//     return '1' + '0'.repeat(111); // Set the significand to have at least one 1 followed by 111 zeros
//   }
//   // If there is a fractional part, return the fractional part including any leading zeroes
//   let fractionalPart = parts[1];
//   // Add leading zeroes to make the significand 112 bits long
//   while (fractionalPart.length < 112) {
//     fractionalPart += '0';
//   }
//   return '1' + fractionalPart.substring(0, 111); // Set the significand to have at least one 1 followed by leading zeros to fill up to 111 bits
// };



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
        baseInput = parseInt(document.querySelector("#base-10").value); // Get the base input
        console.log("hello")
        // Adjust the decimal input according to the base input
        decimalInput *= Math.pow(10, baseInput);
        console.log(decimalInput)
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


    if(binaryInput != 0) {
        //=========== DENORMALIZED ============
        if (baseInput < smallestExponentNormalized) {
            // Denormalized case handling 
            exponent = "0".repeat(15);
            binaryDigits = binaryDigits + exponent;

            // Get the denormalized significand
            remainingDigits = getRemainingDigits(binaryInput);
            significand = completeSignificand(remainingDigits) 

            binaryDigits = binaryDigits + significand;

            // Get hex value
            hexOutput = getHex(binaryDigits);

        //=========== INFINITY ============
        } else if (baseInput > largestExponentNormalized) {
            // Denormalized case handling 
            console.log("hello")
            exponent = "1".repeat(15);
            binaryDigits = binaryDigits + exponent;

            // Get the denormalized significand
            remainingDigits = getRemainingDigits("0");
            significand = completeSignificand(remainingDigits) 

            // append the significand
            binaryDigits = binaryDigits + significand;

            console.log(binaryDigits)

            // Get hex value
            hexOutput = getHex(binaryDigits);

        } else {
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
        }
     
    //=========== ZERO ============
    } else if (binaryInput == 0) {  
        // get the binary value of excess and append
        exponent = "0".repeat(15);
        binaryDigits = binaryDigits + exponent;

        // get the remaining digits
        remainingDigits = getRemainingDigits("0");

        // add zeroes to binary if not complete
        significand = completeSignificand(remainingDigits);
        binaryDigits = binaryDigits + significand;

        // get hex value
        hexOutput = getHex(binaryDigits);
    } else {
  
    }
    
  // assign to output element
    document.querySelector("#hexOutput").innerHTML = hexOutput;
    document.querySelector("#signBit").innerHTML = signBit;
    document.querySelector("#exponent").innerHTML = exponent;
    document.querySelector("#significand").innerHTML = significand;
    }

);

document.querySelector("#outputToFileButton").addEventListener("click", function() {
    const hexOutput = document.querySelector("#hexOutput").innerHTML;
    const signBit = document.querySelector("#signBit").innerHTML;
    const exponent = document.querySelector("#exponent").innerHTML;
    const significand = document.querySelector("#significand").innerHTML;

    // Prepare the content to be written to the text file
    const content = `Hex Output: ${hexOutput}\nSign Bit: ${signBit}\nExponent: ${exponent}\nSignificand: ${significand}`;

    // Create a Blob with the content
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

    // Generate a URL for the Blob
    const fileURL = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const tempLink = document.createElement("a");
    tempLink.href = fileURL;
    tempLink.download = "output.txt"; // Name of the file to be downloaded
    document.body.appendChild(tempLink); // Append to the document
    tempLink.click(); // Programmatically click the link to trigger the download

    // Clean up by removing the temporary link and revoking the Blob URL
    document.body.removeChild(tempLink);
    URL.revokeObjectURL(fileURL);
});





