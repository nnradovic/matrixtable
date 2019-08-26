

//Allow input only numbers
export function _isInputNumber(e) {
    var ch = String.fromCharCode(e.which)
    if (!(/[0-9]/.test(ch))) {
        e.preventDefault()
    }
}

