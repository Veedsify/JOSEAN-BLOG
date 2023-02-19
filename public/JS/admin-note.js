const urlParams = new URLSearchParams(window.location.search);

if (urlParams) {
    if (urlParams.get('post') == 'success') {
        swal({
            text: 'Your post has been published!',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }

    if (urlParams.get('message') == 'success') {
        swal({
            text: 'Your Message has been sent!',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }
    if (urlParams.get('action') == 'enable') {
        swal({
            text: 'Your post has been enabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
    }
    if (urlParams.get('action') == 'disable') {
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

