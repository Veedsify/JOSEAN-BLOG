$("#auth-login-btn").click(function (e) {
    e.preventDefault()

    let username = $('#username').val()

    let password = $("#password").val();

    $.ajax({
        type: "post",
        url: "/login/new",
        data: {
            username,
            password
        },
        success: function (response) {
            runResponse(response)
        }
    });

});

$("#free-plan").click(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/membership/user",
        data: {
            plan: 'free',
        },
        success: function (response) {
            runResponse(response)
        }
    });
});

$("#paid-plan").click(function (e) {
    e.preventDefault();



    $.ajax({
        type: "POST",
        url: "/membership/user",
        data: {
            plan: 'paid',
        },
        success: function (response) {
            runResponse(response)
        }
    });
});


$("#resendMail").click(function (e) {
    e.preventDefault()

    $.ajax({
        type: "POST",
        url: "/register/resendmail",
        data: {
            email: getCookie('email')
        },
        dataType: "",
        success: function (response) {
            runResponse(response)
        }
    });
});

$("#resendBtn").click(function (e) {
    e.preventDefault()

    $.ajax({
        type: "POST",
        url: "/login/resendmail",
        data: {
            email: getCookie('email')
        },
        dataType: "",
        success: function (response) {
            runResponse(response)
        }
    });
});

$("#confirmCode").click(function (e) {
    e.preventDefault();


    let digit1Input = $('#digit1-input').val()
    let digit2Input = $('#digit2-input').val()
    let digit3Input = $('#digit3-input').val()
    let digit4Input = $('#digit4-input').val()

    let finalVal = parseInt(digit1Input + digit2Input + digit3Input + digit4Input)

    if (!finalVal.length < 4) {
        $.ajax({
            type: "POST",
            url: "/login/code",
            data: {
                vcode: finalVal
            },
            success: function (response) {
                runResponse(response)
            }
        });
    } else {
        runResponse({ type: 'alert', text: 'Please enter a valid code', css: 'bad' });
    }

});

$("#featuredImg").change(function (e) {
    let imageInput = document.querySelector('#featuredImg')
    let url = URL.createObjectURL(imageInput.files[0])

    let image = `<img src="${url}" width="300px" alt="">`

    $("#dropImageZone").html(image);
});


// audit function 

function thisUser(user, action) {
    let confirm = window.confirm('Do you want to ' + action + ' ' + user)
    if (confirm === true) {
        if (action === 'delete') {
            $.ajax({
                type: "DELETE",
                url: "/superadmin/users/delete",
                data: {
                    user
                },
                success: function (response) {
                    runResponse(response)
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
            });
        } else if (action === 'disable') {
            $.ajax({
                type: "PUT",
                url: "/superadmin/users/update",
                data: {
                    user,
                    action
                },
                success: function (response) {
                    runResponse(response)
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
            });
        } else if (action === 'enable') {
            $.ajax({
                type: "PUT",
                url: "/superadmin/users/update",
                data: {
                    user,
                    action
                },
                success: function (response) {
                    runResponse(response)
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
            });
        }
    }
}

// BlogPost Function
function sendBlogPost() {
    let posttitle = $('#post-title').val();
    let postcategory = $('#post-category').val();
    let postdescription = $('#post-description').val();
    let post = $('#post').val();
    let featuredImg = $('#featuredImg');


    if (posttitle.length < 10) {
        return runResponse(
            {
                type: 'alert',
                text: 'Sorry You Need to Add a Valid Post Title',
                css: 'bad'
            }
        )
    }
    if (postcategory.length < 3) {
        return runResponse(
            {
                type: 'alert',
                text: 'Sorry You Need to Add a Valid Post Category',
                css: 'bad'
            }
        )
    }
    if (postdescription.length <= 20) {
        return runResponse(
            {
                type: 'alert',
                text: 'Post Description Min Characters 20',
                css: 'bad'
            }
        )
    }
    if (post.length <= 600) {
        return runResponse(
            {
                type: 'alert',
                text: 'Sorry, your post need to be longer than 600 Characters',
                css: 'bad'
            }
        )
    } if (featuredImg[0].files.length <= 0) {
        return runResponse(
            {
                type: 'alert',
                text: 'Please Select a Featured Image',
                css: 'bad'
            }
        )
    }
    document.querySelector('#post-form').submit()
}
// Responce Function
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function runResponse(res) {
    if (res.type == 'link') {
        location.href = res.link

    } else if (res.type == 'alert') {
        let alertBox = document.createElement('div');
        alertBox.className = 'alertbox '
        alertBox.className += res.css
        alertBox.innerHTML = res.text
        document.body.appendChild(alertBox);

        setTimeout(() => {

            alertBox.style.opacity = '0'
            document.body.removeChild(alertBox)

        }, 3000);
    } else {
        location.href = '/'
    }

}

$(".togglebtn").click(function () {
    let ballChild = document.querySelector('.toggleBall');

    if (document.querySelector('.togglebtn').getAttribute('data-mode') !== 'on') {
        $(ballChild).css({
            transform: 'translateX(80%)'
        });
        runResponse({
            type: 'alert',
            text: 'Two factor authentication is now on',
            css: 'good'
        })
        document.querySelector('.togglebtn').setAttribute('data-mode', 'on')
    } else {
        $(ballChild).css({
            transform: 'translateX(0)'
        });
        runResponse({
            type: 'alert',
            text: 'Two factor authentication is now off',
            css: 'good'
        })
        document.querySelector('.togglebtn').setAttribute('data-mode', 'off')
    }
})

function apprPost(slug){
    if(slug.length <= 10){
        $.post("/superadmin/manage/response", {
            user: '',
            action:'APPROVE',
            slug
        },
            function (data) {
                runResponse(data)
            },
        );
    }
}


function approvePost(user, action, slug) {


    $.post("/superadmin/manage/response", {
        user,
        action,
        slug,
        stmt: document.querySelector('.text-box').value || ''


    },
        function (data) {
            runResponse(data)
        },
    );

}

function runResponseWithText(res) {
    let alertBox = document.createElement('div');
    alertBox.className = 'alertbox '
    alertBox.className += res.css
    alertBox.innerHTML += `<p>` + res.text + `</p>`
    alertBox.innerHTML += `<textarea class="text-box"></textarea>`
    alertBox.innerHTML += `<div>
        <button class="btn btn-danger btn-sm" onclick="closeAlert()">Cancel</button>
            <button class="btn btn-success btn-sm" onclick="${res.func}(${res.funcParams})">Proceed</button>
        </div>`

    document.body.appendChild(alertBox);
    document.body.style.pointerEvents = 'none'
    document.body.style.userSelect = 'none'
    alertBox.style.pointerEvents = 'all'
}
function closeAlert() {
    let alertbox = document.querySelectorAll('.alertbox')
    alertbox.forEach(alert => {
        document.body.removeChild(alert)
        document.body.style.pointerEvents = 'all'
        document.body.style.userSelect = 'auto'

    })
}

function denyPost(slug) {
    let alertmode = {
        text: 'Why do you want to disapprove this post',
        css: 'info',
        func: 'approvePost',
        funcParams: `'user','DISAPPROVE','${slug}'`
    }
    runResponseWithText(alertmode);
};

