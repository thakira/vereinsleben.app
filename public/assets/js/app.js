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


$(document).ready(function(){

    // Sidenav
    $('.sidenav').sidenav();

    // Setting Menu
    $('.dropdown-trigger').dropdown();

    // Tabs
    $('.tabs').tabs();

    // Swipeable Tabs Demo Init
    if ($('#tabs-swipe').length) {
        $('#tabs-swipe').tabs({ swipeable: true });
    }

    // Fab
    $('.fixed-action-btn').floatingActionButton();
    $('.fixed-action-btn.horizontal').floatingActionButton({
        direction: 'left'
    });
    $('.fixed-action-btn.click-to-toggle').floatingActionButton({
        direction: 'left',
        hoverEnabled: false
    });
    $('.fixed-action-btn.toolbar').floatingActionButton({
        toolbarEnabled: true
    });
});



