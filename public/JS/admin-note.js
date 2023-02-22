const urlParams = new URLSearchParams(window.location.search);
function removeQueryParam(queryParam, data) {
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
            text: 'Your post has been published!',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('post','success');
    }

    if (urlParams.get('message') == 'success') {
        swal({
            text: 'Your Message has been sent!',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('message','success');
    }
    if (urlParams.get('action') == 'enable') {
        swal({
            text: 'Your post has been enabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('action','enable');
    }
    if (urlParams.get('action') == 'disable') {
        swal({
            text: 'Your post was disabled',
            className: 'bg-page-bg',
            button: {
                className: 'bg-primary'
            }
        })
        removeQueryParam('action','disable');
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

}

