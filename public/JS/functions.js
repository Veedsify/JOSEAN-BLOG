

$("#auth-login-btn").click(function (e) {
    e.preventDefault()

    let username = $('#username').val()

    let password = $("#password").val();

    let user = username.replace(/^\s+|\s+$/gm, '')
    let pass = password.replace(/^\s+|\s+$/gm, '')

    $.ajax({
        type: "post",
        url: "/login/new",
        data: {
            username: user,
            password: pass
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

function checkout(e, plan, success, cancel) {
    e.preventDefault();
    // Open Checkout with further options:
    stripe
        .redirectToCheckout({
            // mode: 'subscription',
            items: [{ plan: plan, quantity: 1 }],
            successUrl: success + '{{}}',
            cancelUrl: cancel,
            // customerEmail: document.getElementById('email').value,
            // billingAddressCollection: "required",
        })
        .then(function (result) {
            if (result.error) {
                console.log(result);
            }
        });
}

// $("#paid-plan").click(function (e) {
//     e.preventDefault();
//     document.body.classList.add('seamless')


// fetch('/membership/user', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         items: [{ id: 1, quantity: 1 }],
//         plan: 'paid',
//     })
// }).then(response => {
//     if (response.ok) {
//         return response.json()
//     } else {
//         return response.json().then(json => Promise.reject(json))
//     }
// }).then(res => {
//     runResponse(res);
// }).catch(e => {
//     console.error(e.error)
// })
// });


$("#resetPass").click(function (e) {
    e.preventDefault();
    let pass = $("#password").val();
    let cpass = $("#cpassword").val();

    if (pass.length >= 8) {
        if (cpass === pass) {
            $.post('/reset/update-passwords', {
                pass: pass,
                cpass: cpass
            }, (data) => {
                if (data && data.result == false) {
                    swal({
                        text: 'Sorry, but Passwords need to match',
                        className: 'bg-page-bg',
                        button: {
                            className: 'bg-danger'
                        }
                    })
                } else if (data && data.result == true) {
                    $("#password").val('');
                    $("#cpassword").val('');
                    swal({
                        text: 'Your Passwords have been updated you can now login',
                        className: 'bg-page-bg',
                        button: {
                            className: 'bg-primary'
                        }
                    })
                }
            })
        } else {
            swal({
                text: 'Sorry, but Passwords need to match',
                className: 'bg-page-bg',
                button: {
                    className: 'bg-danger'
                }
            })
        }
    } else {
        swal({
            text: 'Sorry, but Password Is Too Short',
            className: 'bg-page-bg',
            button: {
                className: 'bg-danger'
            }
        })
    }
});

$("#resendMail").click(function (e) {
    e.preventDefault()

    $.ajax({
        type: "POST",
        url: "/register/resendmail",
        data: {
            email: getCookie('email')
        },
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
        return swal({
            className: 'bg-page-bg',
            text: 'Sorry Title Length Has To Be More Than 10',
            button: {
                className: 'btn-danger'
            }
        })
    }
    if (postcategory.length < 3) {
        return swal({
            className: 'bg-page-bg',
            text: 'Sorry, Post Category Is Too Short',
            button: {
                className: 'btn-danger'
            }
        })
    }
    if (postdescription.length <= 20) {
        return swal({
            className: 'bg-page-bg',
            text: 'Post Description Min Characters 20',
            button: {
                className: 'btn-danger'
            }
        })
    }
    if (post.length <= 600) {
        return swal({
            className: 'bg-page-bg',
            text: 'Sorry, your post need to be longer than 600 Characters',
            button: {
                className: 'btn-danger'
            }
        })
    } if (featuredImg[0].files.length <= 0) {
        return swal({
            className: 'bg-page-bg',
            text: 'Sorry, your post needs a featured image',
            button: {
                className: 'btn-danger'
            }
        })
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
        window.location.href = res.link

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

function apprPost(slug) {
    if (!slug.length <= 10) {
        $.post("/superadmin/manage/response", {
            user: 'user',
            action: 'APPROVE',
            slug
        },
            function (data) {
                runResponse(data)
                setTimeout(() => {
                    location.href = '/superadmin/manage/posts'
                }, 2000);
            },
        );
    }
}


function approvePost(user, action, slug) {


    $.post("/superadmin/manage/response", {
        user,
        action,
        slug,
        stmt: document.querySelector('.text-box').value


    },
        function (data) {
            closeAlert()
            runResponse(data)
            setTimeout(() => {
                location.href = '/superadmin/manage/posts'
            }, 2000);
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

// SWEET ALERTS

function runALert(alert) {
    let localAlert = localStorage.getItem('alt_ngi-ngix-id')

    if (!localAlert) {
        return
    } else {
        if (localAlert != alert._id) {
            swal({
                title: 'New Alert',
                text: alert.message,
                className: 'bg-page-bg',
                button: {
                    confirm: "Ok",
                    className: 'btn-primary'
                },
            }).then((result) => {
                if (result == true) {
                    localStorage.setItem('alt_ngi-ngix-id', alert._id)
                }
            })
        }
    }
}

$.post("/api/getAlerts", {},
    function (data) {
        if (data) {
            runALert(data)
        }
    },
);

let deleteBtns = document.querySelectorAll('.deleteAlert')

deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let id = btn.getAttribute('data-alert')
        $.post("/superadmin/alerts/delete-alert", { id },
            function (data) {
                runResponse(data)
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            },
        );
    });
})


$("#dma").click(function (e) {
    e.preventDefault();
    swal({
        title: 'Delete My Account',
        text: 'This would delete all your post,messages and account, do you wish to proceed?',
        className: 'bg-page-bg',
        buttons: {
            cancel: true,
            confirm: {
                text: 'Delete',
                className: 'btn-danger'
            },
        }
    }).then(result => {
        if (result == true) {
            $.ajax({
                type: "DELETE",
                url: "/user/settings/delete-account",
                data: {},
                success: function (response) {
                    runResponse(response)
                }
            });
        }
    })

});


$('#edp').click(function (e) {
    e.preventDefault();
    let normalHtml = document.createElement('div')


    $.post("/user/settings/getUser", {},
        function (data) {

            normalHtml.innerHTML = inside(data)

            swal({
                title: "Update Your Details",
                className: 'bg-page-bg',
                content: normalHtml,
                buttons: {
                    cancel: true,
                    confirm: {
                        text: 'Update',
                        className: 'btn-primary',
                    }
                }

            }).then(result => {
                if (result !== null) {
                    let fullname = document.querySelector('#fullname')
                    let email = document.querySelector('#email')
                    let bio = document.querySelector('#bio')
                    let user_name = document.querySelector('#user_name')

                    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


                    if (fullname.value.length > 1 && email.value.length > 1 && bio.value.length > 1 && user_name.value.length > 1) {
                        if (!emailRegex.test(email.value)) {
                            swal({
                                className: 'bg-page-bg',
                                icon: "error",
                                text: 'Email is not a valid email address',
                                button: {
                                    className: 'btn-primary'
                                }
                            });
                        } else {
                            let updateForm = document.querySelector('#updateForm')
                            updateForm.submit()
                            swal({
                                className: 'bg-page-bg',
                                icon: "success",
                                button: {
                                    className: 'btn-primary'
                                }
                            });
                            setTimeout(() => {
                                window.location.href = '/logout'
                            }, 2000);

                        }
                    } else {
                        swal({
                            className: 'bg-page-bg',
                            icon: "error",
                            text: 'Please Fill In Some Details',
                            button: {
                                className: 'btn-primary'
                            }
                        });
                    }


                }
            })
        },
    );
});

$('#edpAdmin').click(function (e) {
    e.preventDefault();
    let normalHtml = document.createElement('div')


    $.post("/superadmin/settings/getUser", {},
        function (data) {

            normalHtml.innerHTML = insideAdmin(data)

            swal({
                title: "Update Your Details",
                className: 'bg-page-bg',
                content: normalHtml,
                buttons: {
                    cancel: true,
                    confirm: {
                        text: 'Update',
                        className: 'btn-primary',
                    }
                }

            }).then(result => {
                if (result !== null) {
                    let fullname = document.querySelector('#fullname')
                    let email = document.querySelector('#email')
                    let bio = document.querySelector('#bio')
                    let user_name = document.querySelector('#user_name')

                    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    if (fullname.value.length > 1 && email.value.length > 1 && bio.value.length > 1 && user_name.value.length > 1) {
                        if (!emailRegex.test(email.value)) {
                            swal({
                                className: 'bg-page-bg',
                                icon: "error",
                                text: 'Email is not a valid email address',
                                button: {
                                    className: 'btn-primary'
                                }
                            });
                        } else {
                            let updateForm = document.querySelector('#updateFormAd')
                            updateForm.submit()
                            swal({
                                className: 'bg-page-bg',
                                icon: "success",
                                button: {
                                    className: 'btn-primary'
                                }
                            });
                            setTimeout(() => {
                                window.location.href = '/logout'
                            }, 2000);
                        }
                    } else {
                        swal({
                            className: 'bg-page-bg',
                            icon: "error",
                            text: 'Please Fill In Some Details',
                            button: {
                                className: 'btn-primary'
                            }
                        });
                    }


                }
            })
        },
    );
});


let imageInput = '#pro_img'

$(document).on("change", imageInput, function (event) {

    if (event.target.files[0].size >= 2 * 1024 * 1024) {
        swal({
            text: 'Sorry Images Cannot Exceed 2 Mb in Size',
            className: 'bg-page-bg',
            button: {
                text: 'ok',
                className: 'btn-primary'
            }
        })
        return
    } else {

        let url = URL.createObjectURL(event.target.files[0])

        let iconPrev = document.querySelector('#icon-prev')

        iconPrev.src = url
    }

});


$('#resetEmail').click(function (e) {
    e.preventDefault();
    $.post("/login/reset", {
        email: $('#email').val()
    },
        function (data) {
            if (data.type === 'alert') {
                swal({
                    text: data.text,
                    className: 'bg-page-bg',
                    button: {
                        className: 'btn-primary'
                    }
                })
            } else {
                window.location.href = data.link
            }
        }
    );
});



$(".disableVpost").on('click',function (e) { 
    e.preventDefault();
    swal({
        text: 'Are you sure you want to disable this post?',
        className: 'bg-page-bg',
        buttons: {
            cancel: true,
            confirm: {
                text: 'Yes',
                className: 'bg-primary',
            }
        }
    }).then(result =>{
        if(result == true){
            let parent = e.target.closest('form')
            parent.submit()
        }
    })
});
$(".enableVpost").on('click',function (e) { 
    e.preventDefault();
    swal({
        text: 'Are you sure you want to enable this post?',
        className: 'bg-page-bg',
        buttons: {
            cancel: true,
            confirm: {
                text: 'Yes',
                className: 'bg-primary',
            }
        }
    }).then(result =>{
        if(result == true){
            let parent = e.target.closest('form')
            parent.submit()
        }
    })
});
$(".deleteVpost").on('click',function (e) { 
    e.preventDefault();
    swal({
        text: 'Are you sure you want to delete this post?',
        className: 'bg-page-bg',
        buttons: {
            cancel: true,
            confirm: {
                text: 'Yes',
                className: 'bg-primary',
            }
        }
    }).then(result =>{
        if(result == true){
            let parent = e.target.closest('form')
            parent.submit()
        }
    })
});