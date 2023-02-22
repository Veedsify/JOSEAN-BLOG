let blogPost = document.querySelectorAll('[data-link]')

let copyBtn = document.querySelectorAll('.copybtn')


// Copy. svg.
copyBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let manHolder = e.target.closest('div')
        let codeBlock = manHolder.querySelector('code')
        var r = document.createRange();
        r.selectNode(codeBlock);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(r);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();

        let closeImg = manHolder.querySelector('img')
        closeImg.src = '/IMAGES/check.svg'

        setTimeout(() => {
            closeImg.src = '/IMAGES/copy.svg'
        }, 1000);
    })
})



// Load hero.
$('.read-post').click(function (e) {
    let hero = document.querySelector('.hero')
    let height = hero.clientHeight
    console.log(height)
    window.scrollBy('0', height + 100)
});



$(document).ready(function () {
    setTimeout(() => {
        $("#preloader").addClass('remove');
    }, 700);
});


window.onload = function () {
    sessionStorage.setItem('category', 'all')
}


let categorybuttons = document.querySelectorAll('.catBtn')


categorybuttons.forEach(categoryBtn => {

    categoryBtn.addEventListener('click', () => {
        let postGrid = document.querySelector('.post-grid');

        postGrid.innerHTML = ''

        let postFilter = categoryBtn.getAttribute('data-filter')

        $.ajax({
            type: "POST",
            url: "/getblogs",
            data: {
                category: postFilter
            },
            success: function (response) {
                if (response.length < 1) {
                    postGrid.innerHTML = '<h3 class="no-post-found">No Post Found.</h3>'
                } else {
                    postGrid.innerHTML = ''
                    sessionStorage.setItem('category', postFilter)
                    response.forEach(post => {
                        let newPost = createPost(post);
                        postGrid.innerHTML += newPost;
                    })
                }

            },
            beforeSend: function () {
                let img = '<img src ="/IMAGES/loader.gif" class="forceLoader" >';
                postGrid.innerHTML = img
            }
        });
    })
})

function createPost(post) {
    let newPost = `
    <div class="blog-container" data-link="${post.slug_id} ">
            <a class="post-link" href="/posts/${post.slug_id}">
    
                <img src="${post.image}" alt="${post.title} " class="blog-image">
                <div class="blog-info">
                    <div class="blog-category">
                        ${post.category}
                    </div>
                    <div class="blog-title">${post.title}</div>
                    <div class="blog-date">Published On: ${post.date}</div>
                    <hr class="line">
                </div>
            </a>
            <div class="authors-info">
                <img src="${post.author_image}" alt="${post.author_name}" class="author-image">
                <strong><a href="/${post.author_username}">${post.author_name}</a></strong>
            </div>
        </div>
    `;
    return newPost
}

$("#load-more-post").click(function (e) {
    e.preventDefault();
    let postGrid = document.querySelector('.post-grid')
    let categoryData = sessionStorage.getItem('category')

    let loadMoreCount = postGrid.children.length


    if (categoryData === null) {
        categoryData = 'all'
    }
    $.ajax({
        type: "POST",
        url: "/loadnewpost",
        data: { categoryData, loadMoreCount },
        dataType: "",
        success: function (response) {
            $('.loadImagebox').remove()
            $("#load-more-post").html('Load More...')

            response.forEach(blog => {
                postGrid.innerHTML += createPost(blog)
            })

        }, beforeSend: function () {
            let img = '<div class="loadImagebox"><img src ="/IMAGES/loader.gif" class="loadmoreimg" ></div>';
            postGrid.innerHTML += img
            $("#load-more-post").html('Loading ' + 'More' + ' Articles...')
        }
    });


});


$(".burger").click(function (e) {
    e.preventDefault()

    $(".menu-links").toggleClass('active');

    if (document.querySelector('.menu-links').className === 'menu-links active') {
        document.querySelector('.burger').src = '/IMAGES/close.svg'
    } else {
        document.querySelector('.burger').src = '/IMAGES/menu.svg'
    }

});

// IMPRESSION COUNT

// Impressions COunt
const targetNode = document.querySelector('body');
const observerOptions = {
    childList: true,
    subtree: true
};
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            checkDivVisibility();
        }
    }
});
observer.observe(targetNode, observerOptions);
let checkedElements = [];
checkDivVisibility();
function isVisible(el) {
    return !!(el.offsetParent || el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

function checkDivVisibility() {
    let blogContainers = document.querySelectorAll('.blog-container')
    const newDivs = Array.from(blogContainers).filter(x => !checkedElements.includes(x));
    for (const post of newDivs) {
        if (isVisible(post) === true) {
            updateImpressions(post.getAttribute('data-link'))
            checkedElements.push(post);
        }
    }
}

function updateImpressions(slug){
    $.ajax({
        type: "POST",
        url: `/updateImpressions/${slug}`,
        data: {
            postId: slug
        },
        success: function (response) {
            return
        }
    });
}

