const URL_PLACES = "https://places.googleapis.com/v1/places/ChIJQzX5RY7LvJURd-ZvhLIZXLU?fields=id,displayName,rating,userRatingCount,reviews&key=AIzaSyDzhYmaTyanY0NMOySzsA4uouaGGkxt438";

function backToTop() {
    $("html, body").animate({
        scrollTop: 0
    });
}

function initGoogleData() {
    $.ajax({
        url: URL_PLACES,
        success: function (result) {
            getReviews(result.reviews.slice(0, 4));
            getRating(result.rating);
            $("#userRatingCount").text(result.userRatingCount + " opiniones");
            $("#rating").show();
            $("#reviews").show();
        },
        error: function (result) {
            console.log("initGoogleData error:");
            console.log(result);
            $("#itemMenuReviews").hide();
        }
    });
}

function getStars(starsCount) {
    let ratingStars = "";
    for (let i = 0; i < starsCount.starsFill; i++) {
        ratingStars += '<li><i class="bi bi-star-fill"></i></li>';
    }
    if (starsCount.starsHalf !== 0) {
        ratingStars += '<li><i class="bi bi-star-half"></i></li>';
    }
    for (let i = 0; i < starsCount.starsNoFill; i++) {
        ratingStars += '<li><i class="bi bi-star"></i></li>';
    }
    return ratingStars;
}

function getReviewTemplate() {
    return '<div class="col-xl-3 col-lg-6 col-md-6 col-12 mt-3"><div class="card"><div class="card-body"><div class="d-flex justify-content-center mb-2">REVIEW_IMG</div><h4 class="card-title">REVIEW_NAME</h4><p class="card-text review-text mb-2">REVIEW_TEXT</p><ul class="list-unstyled d-flex justify-content-center m-0">REVIEW_STARS</ul><p class="card-text"><small class="text-body-secondary">REVIEW_PUBLISH_TIME</small></p></div></div></div>';
}

function getStarsCount(ratingNumber) {
    let starsFill = parseInt(ratingNumber);
    let starsHalf = 0;
    let ratingHalfNumber = parseFloat((ratingNumber - starsFill).toFixed(2));
    if (ratingHalfNumber > 0.2 && ratingHalfNumber < 0.8) {
        starsHalf = 1;
    } else if (ratingHalfNumber >= 0.8) {
        starsFill++;
    }
    let starsNoFill = 5 - starsFill - starsHalf;
    return {
        "starsFill": starsFill,
        "starsHalf": starsHalf,
        "starsNoFill": starsNoFill,
    };
}

function getReviews(reviews) {
    reviews.forEach(function(item) {
        let review = getReviewTemplate();
        review = review.replace("REVIEW_IMG", '<img src="' + item.authorAttribution.photoUri + '" alt="' + item.authorAttribution.displayName + '" width="100" height="100">');
        review = review.replace("REVIEW_NAME", item.authorAttribution.displayName);
        let reviewText = item.originalText.text.substring(0, 120);
        if (item.originalText.text.length > 120) {
            reviewText += "...";
        }
        review = review.replace("REVIEW_TEXT", '"' + reviewText + '"');
        review = review.replace("REVIEW_STARS", getStars(getStarsCount(item.rating)));
        review = review.replace("REVIEW_PUBLISH_TIME", item.relativePublishTimeDescription);
        $("#listReviews").append(review);
    });
}

function getRating(ratingNumber) {
    $("#ratingNumber").text(ratingNumber);
    $("#ratingStars").html(getStars(getStarsCount(ratingNumber)));
}

$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $("#backToTopBtn").fadeIn();
        } else {
            $("#backToTopBtn").fadeOut();
        }
    });

    $("body").scrollspy({
        target: "#navbarMenu",
        offset: 300
    });

    $(".nav-link").click(function(e) {
        e.preventDefault();
        $("html, body").animate({
            scrollTop: $($(this).attr("href")).offset().top - 75
        });
    });

    initGoogleData();
});
