const urlParams = new URLSearchParams(window.location.search);

if (urlParams) {
    if (urlParams.get('post') == 'success') {
        swal({
            text: 'Post Has Been Submitted To The Admin For Approval, you\'ll get a notification when your post is approved',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }

    if (urlParams.get('message') == 'success') {
        swal({
            text: 'Your Message has been sent to the Admin',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }
    if (urlParams.get('action') == 'enabled') {
        swal({
            text: 'Your post has been enabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }
    if (urlParams.get('action') == 'disabled') {
        swal({
            text: 'Your post was disabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }
    if (urlParams.get('action') == 'delete') {
        swal({
            text: 'Your post was deleted',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }

}