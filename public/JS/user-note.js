const urlParams = new URLSearchParams(window.location.search);
function removeQueryParam(queryParam,data) {
    // Get the current URL
    let currentUrl = window.location.href;

    // Remove the specified query parameter from the URL
    let newUrl = currentUrl.replace(`?${queryParam}=${data}`, '');

    // Update the URL in the browser
    window.history.replaceState({}, document.title, newUrl);
}

if (urlParams) {
    if (urlParams.get('post') == 'success') {
        swal({
            text: 'Post Has Been Submitted To The Admin For Approval, you\'ll get a notification when your post is approved',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('post','success');
    }

    if (urlParams.get('message') == 'success') {
        swal({
            text: 'Your Message has been sent to the Admin',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('message','success');
    }
    if (urlParams.get('action') == 'enabled') {
        swal({
            text: 'Your post has been enabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('action','enabled');
    }
    if (urlParams.get('action') == 'disabled') {
        swal({
            text: 'Your post was disabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('action','disabled');
    }
    if (urlParams.get('action') == 'delete') {
        swal({
            text: 'Your post was deleted',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('action','delete');
    }
    if (urlParams.get('username') == 'error') {
        swal({
            text: 'Sorry, the username you entered has already been taken',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('username','error');
    }

}