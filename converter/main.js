const getExcess = (base) => {
    return parseInt(base) + parseInt("16383");
};

const getBinary = (decimal) => {
    let binary = ""
    while (decimal > 1) {
        let remainder = decimal % 2
        binary = remainder.toString().concat(binary)
        decimal = Math.floor(decimal /= 2)
    }
    binary = decimal.toString().concat(binary)
    return binary
}

const getRemainingDigits = (binaryInput) => {
    let result = ""
    result = binaryInput.toString().substring(2, )
    return result
}

const completeSignificand = (remainingDigits) => {
    while(remainingDigits.length != 112) {
        remainingDigits += '0'
    }
    return remainingDigits
}

const getHexValue = (binaryDigits) => {
    console.log(binaryDigits)
    let decimal = parseInt(binaryDigits, 2);
    let hex = decimal.toString(16);
    return hex.toUpperCase()
}

document.querySelector('#submit').addEventListener("click", function(e) {
    e.preventDefault()

    // get the binary input and base input
    let binaryInput = document.querySelector('#binary').value
    let baseInput = document.querySelector('#base').value

    // declare the binary digits
    let binaryDigits = ""
    let signBit = ""
    // append the sign bit
    if(binaryInput < 0) {
        signBit = '1'
        binaryInput *= -1 // make input positive
    } else {
        signBit = '0'
    }
    binaryDigits += signBit

    // normalize the binary input
    if(binaryInput > 1){
        while(Math.floor(binaryInput) != 1){
            binaryInput /=  10
            baseInput += 1
        }
    } else if (binaryInput < 1 && binaryInput > 0) {
        while(Math.floor(binaryInput) != 1) {
            binaryInput *= 10
            baseInput -= 1
        }
    } else {
        // baseInput and binaryinput remains the same
    }

    // get the excess 
    let excess = getExcess(baseInput)
    
    // get the binary value of excess and append
    let exponent = getBinary(excess)
    binaryDigits = binaryDigits + exponent

    // get the remaining digits
    let remainingDigits = getRemainingDigits(binaryInput)

    // add zeroes to binary if not complete
    let significand = completeSignificand(remainingDigits)
    binaryDigits = binaryDigits + significand

    // get hex value
    let hexOutput = getHexValue(binaryDigits)

    // assign to output element
    document.querySelector('#hexOutput').innerHTML = hexOutput
    document.querySelector('#signBit').innerHTML = signBit
    document.querySelector('#exponent').innerHTML = exponent
    document.querySelector('#significand').innerHTML = significand
})
