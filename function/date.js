function getDate(){
    let now = Date.now()
    let date = new Date(now)
    let blogDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return blogDate
}

module.exports = getDate