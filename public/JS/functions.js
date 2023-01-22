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



// Responce Function




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