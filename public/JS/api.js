
setInterval(apiRefresh, 5000);

function apiRefresh() {
    setTimeout(function () {
        $.post("/api/getBlogImpressions", {},
            function (response) {
                function formatNumber(number) {
                    if (number >= 1000000) {
                        return (number / 1000000).toPrecision(3) + 'M';
                    } else if (number >= 1000) {
                        return (number / 1000).toPrecision(3) + 'k';
                    }
                    return number.toString();
                }
                let impressions = formatNumber(response)

                $("#impression").html(impressions);
            },
        );
    }, 2200)
    setTimeout(function () {
        $.post("/api/getBlogviews", {},
            function (response) {
                function formatNumber(number) {
                    if (number >= 1000000) {
                        return (number / 1000000).toPrecision(3) + 'M';
                    } else if (number >= 1000) {
                        return (number / 1000).toPrecision(3) + 'k';
                    }
                    return number.toString();
                }
                let views = formatNumber(response)

                $("#views").html(views);
            },
        );
    }, 2300)
    setTimeout(function () {
        $.post("/api/postCount", {},
            function (response) {
                function formatNumber(number) {
                    if (number >= 1000000) {
                        return (number / 1000000).toPrecision(3) + 'M';
                    } else if (number >= 1000) {
                        return (number / 1000).toPrecision(3) + 'k';
                    }
                    return number.toString();
                }
                let posts = formatNumber(response)

                $("#posts").html(posts);
            },
        );
    }, 2400)

    setTimeout(function () {
        $.post("/api/mostPost", {},
            function (response) {
                function formatNumber(number) {
                    if (number >= 1000000) {
                        return (number / 1000000).toPrecision(3) + 'M';
                    } else if (number >= 1000) {
                        return (number / 1000).toPrecision(3) + 'k';
                    }
                    return number.toString();
                }
                let single = formatNumber(response)

                $("#single").html(single);
            },
        );
    }, 2500)

    setTimeout(function () {
        $.post("/api/myartcles", {},
            function (response) {
                if (response && response.length > 0) {
                    let articleContainer = document.getElementById('article');
                    if (articleContainer) {
                        articleContainer.innerHTML = '';
                        response.forEach(post => {
                            let article = `
                            <p class="bg-page-bg p-3 rounded-1">
                            <a href="/posts/${post.slug_id}" class="text-white">${post.title}</a>
                            </p>  
                            `;
                            articleContainer.innerHTML += article;
                        });
                    }
                }
            }
        );
    }, 2600);


    setTimeout(function () {
        $.post("/api/getNotifications", {},
            function (response) {

                let alertCount = response.length
                let notifyBox = document.querySelector('#notify-alert')

                notifyBox.innerHTML = ''
                response.forEach((notification) => {

                    try {

                        let diffDate = GetDateFunction(notification.duration)

                        let notify = `<div class="text-reset notification-item">
                    <div class="d-flex" data-id="${notification._id}">
                        <div class="flex-shrink-0 me-3">
                            <img src="${notification.sender_image}"
                                class="rounded-circle avatar-sm" alt="user-pic">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${notification.sender}</h6>
                             <div class="font-size-13 text-muted">
                                <p class="mb-1">${notification.message}</p>
                                <p class="mb-0"><i class="mdi mdi-clock-outline"></i> ${diffDate}<span></span></p>
                            </div>
                         </div>
                         <button class="btn btn-sm btn-danger align-self-start" onclick="dAlert('${notification._id}')" ><i class="mdi mdi-trash-can"></i></button>
                     </div>
                                </div> 
                                `;

                        notifyBox.innerHTML += notify
                    } catch (e) {
                        console.log(e.message)
                    }
                })

                document.getElementById('unread').innerHTML = alertCount
            },
        );
    }, 2600)

}


function dAlert(id) {
    $.ajax({
        type: "DELETE",
        url: "/api/alerts/delete",
        data: { id },
        success: function (response) {
            runResponse(response)

        }
    });
}


let GetDateFunction = (preDate) => {
    const initialDate = new Date(preDate);
    const currentDate = new Date();

    const differenceInMs = currentDate - initialDate;

    const durationInSeconds = differenceInMs / 1000;
    const durationInMinutes = durationInSeconds / 60;
    const durationInHours = durationInMinutes / 60;
    const durationInDays = durationInHours / 24;

    let duration;
    if (durationInDays >= 1) {
        duration = `${Math.floor(durationInDays)} days ago`;
    } else if (durationInHours >= 1) {
        duration = `${Math.floor(durationInHours)} hours ago`;
    } else if (durationInMinutes >= 1) {
        duration = `${Math.floor(durationInMinutes)} minutes ago`;
    } else {
        duration = `${Math.floor(durationInSeconds)} seconds ago`;
    }

    return duration

}