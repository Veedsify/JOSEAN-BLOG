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
    }else{
        runResponse({type:'alert', text:'Please enter a valid code', css: 'bad'});
    }

});

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