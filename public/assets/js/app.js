'use strict'

// Check if fields are not empty
function checkForm() {
    const email = document.querySelector('input[name="email"]').value
    const password = document.querySelector('input[name="password"]').value

    console.log('Übergeben: ' + email + ' ' + password);

    if (!email || !password) {
        console.log('Übergeben: ');
        alert('Empty fields !!!!!!')
        return false
    }

    return true
}