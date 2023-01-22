let blogPost = document.querySelectorAll('[data-link]')

// Click on a blog.
blogPost?.forEach(blog => {
    blog.addEventListener('click', () => {
        let newUrl = blog.getAttribute('data-link')
        location.href = newUrl
    })
})

let postImage = document.querySelector('#post-image')

// Creates a preview of the image.
postImage?.addEventListener('change', (e) => {
    let url = URL.createObjectURL(postImage.files[0])
    document.querySelector('.preview').src = url
})


// Generates a code response.
function codeRes(response) {

    if (response.type == 'alert') {
        let newAlert = document.createElement('div')
        newAlert.className = 'alert'
        newAlert.classList.add(response.status)
        newAlert.innerHTML = response.message

        document.body.appendChild(newAlert);

        setTimeout(() => {
            let alert = document.querySelector('.alert')

            if (alert) {
                alert.remove()
            }

        }, 3000);
    } else if (response.type == 'url') {
        location.href = response.link
    }

}

// Click on the publish button
$("#publish").click(function (e) {
    e.preventDefault();

    let confirmation = window.confirm("Are you sure you want to publish?")

    if (confirmation === true) {
        let form = $("#newpost")
        let title = $('#post-title').val()
        let category = $('#post-category').val()
        let post = $('#post').val()
        let postImage = $('#post-image').val()

        if (title.length != '' && category.length != '' && post.length != '' && postImage.length != '') {
            form.submit();
        } else {
            alert('All Fields Are Required')
        }

    }
});


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
            dataType: "",
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
    <div class="blog-container" data-link="/posts/${post.slug_id} ">
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
                <img src="/IMAGES/hero.jpg" alt="" class="author-image">
                <strong><a href="/">Tony Stark</a></strong>
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
            $("#load-more-post").html('Loading ' + categoryData + ' Articles...')
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
let blogContainers = document.querySelectorAll('.blog-container')

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target)
        }
    })
}, { threshold: 1 })


    blogContainers.forEach(post => {
        observer.observe(post)
    })
