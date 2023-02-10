function inside(data) {
    return `
    <form method="POST" action="/user/settings/updateDetails" id="updateForm" enctype="multipart/form-data">
        <div class="form-group">
            <label for="pro_img" class="d-flex justify-content-center flex-column align-items-center">
                <img width="100" id="icon-prev" src="${data.profile_image}" class="rounded-circle d-block m-auto" style="object-fit:cover; aspect-ratio: 1/1;">
                <small class="m-1">Click To Upload</small>
                <input type="file" class="hidden" id="pro_img" name="userImage">
            </label>
        </div>
        <div class="form-group mb-4">
            <label for="fullname" class="text-left">Fullname:</label>
            <input type="text" id="fullname" name="fullname" value="${data.name}" class="form-control">
        </div>
        <div class="form-group mb-4">
            <label for="email" class="text-left">Email Address:</label>
            <input type="email" id="email" name="email" class="form-control" value="${data.email}">
        </div>
        <div class="form-group mb-4">
            <label for="bio" class="text-left">Bio:</label>
            <textarea type="text" id="bio" name="bio" class="form-control">${data.bio}</textarea>
        </div>
        <div class="form-group mb-4">
            <label for="user_name" class="text-left">Username:</label>
            <input type="text" id="user_name" name="user_name" class="form-control" value="${data.user_name}">
        </div>
    </form>
`;
}
function insideAdmin(data) {
    return `
    <form method="POST" action="/superadmin/settings/updateDetails" id="updateFormAd" enctype="multipart/form-data">
        <div class="form-group">
            <label for="pro_img" class="d-flex justify-content-center flex-column align-items-center">
                <img width="100" id="icon-prev" src="${data.profile_image}" class="rounded-circle d-block m-auto" style="object-fit:cover; aspect-ratio: 1/1;">
                <small class="m-1">Click To Upload</small>
                <input type="file" class="hidden" id="pro_img" name="userImage">
            </label>
        </div>
        <div class="form-group mb-4">
            <label for="fullname" class="text-left">Fullname:</label>
            <input type="text" id="fullname" name="fullname" value="${data.name}" class="form-control">
        </div>
        <div class="form-group mb-4">
            <label for="email" class="text-left">Email Address:</label>
            <input type="email" id="email" name="email" class="form-control" value="${data.email}">
        </div>
        <div class="form-group mb-4">
            <label for="bio" class="text-left">Bio:</label>
            <textarea type="text" id="bio" name="bio" class="form-control">${data.bio}</textarea>
        </div>
        <div class="form-group mb-4">
            <label for="user_name" class="text-left">Username:</label>
            <input type="text" id="user_name" name="user_name" class="form-control" value="${data.user_name}">
        </div>
    </form>
`;
}