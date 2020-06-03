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

/*
const dateToDE = (d) => {
    let date = new Date(d);
    let tag = date.getDate().toString().length < 2 ? "0" + date.getDate() : date.getDate();
    let monat = date.getMonth() + 1;
    let jahr = date.getFullYear();
    return tag + "." + monat + "." + jahr;
}
*/


$(document).ready(function(){

    console.log("App gestartet")

    if('service worker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(error => console.log(error))
    }

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

$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    $('body').bootstrapMaterialDesign();
});

$(document).ready(function() {
    $('#material-tabs').each(function() {

        var $active, $content, $links = $(this).find('a');

        $active = $($links[0]);
        $active.addClass('active');

        $content = $($active[0].hash);

        $links.not($active).each(function() {
            $(this.hash).hide();
        });

        $(this).on('click', 'a', function(e) {

            $active.removeClass('active');
            $content.hide();

            $active = $(this);
            $content = $(this.hash);

            $active.addClass('active');
            $content.show();

            e.preventDefault();
        });
    });
});
