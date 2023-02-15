// Register for a new account the normal way and update the following values
// For Admin Register a user and update these values in the db

role = superadmin
membership = paid
trial = false
verified = true
status = public
statusAdmin = public


// For User With Paid Membership

role = user
membership = paid
trial = false
verified = true
status = public
statusAdmin = public



// For Free User membership
role = user
membership = free
trial = false
verified = true
status = public
statusAdmin = public


// For user that trial has ended
role = user
membership = paid
trial = ended
verified = true
status = public
statusAdmin = public


// For user that has been banned by superadmin
role = user
membership = paid
trial = false
verified = true
status = public
statusAdmin = hidden
