'use strict'

// Check if fields are not empty
function checkForm() {
    const email = document.querySelector('input[name="email"]').value
    const email2 = document.querySelector('input[name="repEmail"]').value
    const password = document.querySelector('input[name="password"]').value
    const password2 = document.querySelector('input[name="repPwd"]').value

    let check = true;
    if(!checkRepeat(password,password2, "prn")) {
        document.querySelector('input[name="repPwd"]').focus()
        check = false
    }
    if(!checkRepeat(email, email2, "ern") && !validateEmail(email)) {
        document.querySelector('input[name="email"]').focus()
        check = false
    }
    console.log(check)
    return check
}

function checkRepeat(value1, value2, toggleId) {
    if(value1 != "" && value2 != "" && value1 != value2) {
        document.getElementById(toggleId).classList.remove("invisible")
        return false
    } else {
        document.getElementById(toggleId).classList.add("invisible")
    }
    return true
}

function validateEmail(mail) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!(re.test(mail))) {
        document.getElementById("emailAlert").classList.remove("invisible")
        console.log("a: " + re.test(mail))
    } else {
        document.getElementById("emailAlert").classList.add("invisible")
        console.log("b: " + re.test(mail))
    }
    return re.test(mail)
}

// Date to German Format
let dates = document.getElementsByClassName("datum");
if(dates.length>0){
    for(let e=0; e<dates.length;e++) {
        let d = new Date(dates[e].getAttribute("del-date"))
        let tag = d.getDate();
        tag = (tag<10) ? "0"+tag : tag
        let monat = d.getMonth() + 1;
        monat = (monat<10) ? "0"+monat : monat;
        let jahr = d.getFullYear();
        dates[e].innerHTML = tag + "." + monat + "." + jahr;
    }
}

$(document).ready( function() {

    console.log("App gestartet")

    if('service worker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(error => console.log(error))
    }

    // Setting Menu
    $('.dropdown-trigger').dropdown();

    // Swipeable Tabs
    if ($('#tabs-swipe').length) {
        $('#tabs-swipe').tabs({ swipeable: true });
    }

    // Fab
    // $('.fixed-action-btn').floatingActionButton();
    // $('.fixed-action-btn.horizontal').floatingActionButton({
    //     direction: 'left'
    // });
    // $('.fixed-action-btn.click-to-toggle').floatingActionButton({
    //     direction: 'left',
    //     hoverEnabled: false
    // });
    // $('.fixed-action-btn.toolbar').floatingActionButton({
    //     toolbarEnabled: true
    // });
});

function myfkt(file){
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = URL.createObjectURL(file);
    console.log(img);
    canvas.width = 200;
    canvas.height = 200;
    img.onload = function(){
        ctx.save();
        ctx.beginPath();
        ctx.arc(100, 100, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, 200, 200);

        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();

        //
        // let canvas = document.getElementById("canvas");
        // let thumb = canvas.toDataURL("image/png");
        // $("#canvas").append('<img width="20" height="20" src='+thumb+'>');
    }
}
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
