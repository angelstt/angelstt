function backToTop() {
    $('html, body').animate({
        scrollTop: 0
    });
}

$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#backToTopBtn').fadeIn();
        } else {
            $('#backToTopBtn').fadeOut();
        }
    });

    $('body').scrollspy({
        target: '#navbarMenu',
        offset: 300
    });

    $('.nav-link').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 75
        });
    });
});
