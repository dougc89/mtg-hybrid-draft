/*****PHONENUMBERS: Factory Function****************************************************************************/
function PHONENUMBERS() {
    var phonenumbers = {};//we will build this
    phonenumbers.APItoken = null; //we will set this once the Pingboard Oauth token generation is complete (see mobilephones/js/funcs.php)
    phonenumbers.activePingboardUser = { lcsoID: null, pingboardID: null };
    phonenumbers.lookupFailures = 0;//keeping track of lookup failures

    phonenumbers.initialize = function () {
        $('.lookup-btn').click(function () {
            var lcsoID = $('input[name=lcsoID]').val();//the id they are requesting on
            phonenumbers.activePingboardUser.lcsoID = lcsoID;
            phonenumbers.activePingboardUser.pingboardID = null;//reseting, so we don't accidentally use a previous pingboardID
            phonenumbers.PingboardGetMobilePhone(lcsoID);//should get both their existing mobile phone number AND their pingboardID | Note, this happens async of the Active Directory lookup
            phoneNumbersLookup.submit();
            $('.phoneNumberEntry-form').html(['<div class="col-12 row justify-content-center my-5">',
                '<div class= "spinner-grow text-primary" role = "status" >',
                '<span class="sr-only">Loading...</span>',
                '</div >',
                '</div >'].join(''));//using an array.join() for IE friendly, since IE can't interpret interpolated strings...
        });

        $('.phoneNumberEntry-form .employeeID-entry').on('keyup', function (event) {//also submits if you hit enter
            if (event.keyCode === 13) {
                event.preventDefault();
                var lcsoID = $('input[name=lcsoID]').val();//the id they are requesting on
                phonenumbers.activePingboardUser.lcsoID = lcsoID;
                phonenumbers.activePingboardUser.pingboardID = null;//reseting, so we don't accidentally use a previous pingboardID
                phonenumbers.PingboardGetMobilePhone(lcsoID);//should get both their existing mobile phone number AND their pingboardID | Note, this happens async of the Active Directory lookup
                phoneNumbersLookup.submit();
                $('.phoneNumberEntry-form').html(['<div class="col-12 row justify-content-center my-5">',
                    '<div class= "spinner-grow text-primary" role = "status" >',
                    '<span class="sr-only">Loading...</span>',
                    '</div >',
                    '</div >'].join(''));//using an array.join() for IE friendly, since IE can't interpret interpolated strings...
            }
        });

    }//end: initialize method

    phonenumbers.currentPhoneNumbers = function (ADinfo) {
        //@phoneNumbers: object {AD: array | returned from getADinfo.php, Pingboard: null} << still working on that Pingboard API connection...
        var currentADmobilePhone = 'NO MOBILE NUMBER IN AD';//default value
        var currentADofficePhone = 'NO OFFICE NUMBER IN AD';//default value
        if (!ADinfo['LCSOID']) {
            notification.toast('#material-toast-bottom-right', 'That employee was not found', '<i class="fas fa-frown fa-lg"></i>');//dependency on notification object methods (in meta.js)
            navigation.load('/mobilephones/page/phoneNumberEntry.php', { loadTimeout: 0, reinitialize: phonenumbers }).setActive('adminPage');//dependency on NAVIGATION object
        }
        //Interpret the values in ADinfo array:
        if (ADinfo['MOBILEPHONE']) currentADmobilePhone = ADinfo['MOBILEPHONE'];//display the AD value if we found it
        if (ADinfo['TELEPHONE']) currentADofficePhone = ADinfo['TELEPHONE'];//display the AD value if we found it

        var formReplacement = "<div class='input-group col-4 mb-3'><div class='input-group-prepend'><span class='input-group-text' >LCSO Employee #:</span></div>";
        formReplacement += "<input name='lcsoID' class='form-control' aria-label='LCSO Employee #' type='text' disabled value='" + ADinfo['LCSOID'] + "' ></div>";//closes both the append div and container around this field
        //Show first and last names from AD record:
        formReplacement += "<div class='input-group col-4 mb-3'><div class='input-group-prepend'><span class='input-group-text' >First Name:</span></div>";
        var fname_disp = (ADinfo['FNAME'] ? ADinfo['FNAME'].replace(/'/g, '&apos;') : '');
        formReplacement += "<input name='firstName' class='form-control' aria-label='First Name' type='text' disabled value='" + fname_disp + "' ></div>";//closes both the append div and container around this field | Note: replaces any single quotes in name with html &apos; encoding to avoid breaking html

        formReplacement += "<div class='input-group col-4 mb-3'><div class='input-group-prepend'><span class='input-group-text' >Last Name:</span></div>";
        var lname_disp = (ADinfo['LNAME'] ? ADinfo['LNAME'].replace(/'/g, '&apos;') : '');
        formReplacement += "<input name='lastName' class='form-control' aria-label='Last Name' type='text' disabled value='" + lname_disp + "' ></div>";//closes both the append div and container around this field | Note: replaces any single quotes in name with html &apos; encoding to avoid breaking html

        //Active Directory phones section:
        formReplacement += "<p class='h4 col-12 mb-3'>Active Directory:</p>";
        formReplacement += "<div class='input-group col-6 mb-3'><div class='input-group-prepend'><span class='input-group-text' >Mobile Phone:</span></div>";
        formReplacement += "<input name='ADmobileNumber' type='text' class='form-control' aria-label='AD Mobile Phone Number' disabled value='" + currentADmobilePhone + "' maxlength='20'></div>";//closes both the append div and container around this field

        formReplacement += "<div class='input-group col-6 mb-3'><div class='input-group-prepend'><span class='input-group-text' >Office Phone:</span></div>";
        formReplacement += "<input name='ADofficeNumber' type='text' class='form-control' aria-label='AD Office Phone Number' disabled value='" + currentADofficePhone + "' maxlength='20'></div>";//closes both the append div and container around this field

        //Pingboard phones section:
        formReplacement += "<p class='h4 col-12 mb-3'>Pingboard:</p>";
        formReplacement += "<div class='input-group col-6 mb-3'><div class='input-group-prepend'><span class='input-group-text' >Mobile Phone:</span></div>";
        formReplacement += "<input name='PingboardMobileNumber' type='text' class='form-control' aria-label='Pingboard Mobile Phone Number' disabled value='LOADING...' maxlength='20'></div>";//closes both the append div and container around this field

        formReplacement += "<div class='input-group col-6 mb-3'><div class='input-group-prepend'><span class='input-group-text' >Office Phone:</span></div>";
        formReplacement += "<input name='PingboardOfficeNumber' type='text' class='form-control' aria-label='Pingboard Office Phone Number' disabled value='LOADING...' maxlength='20'></div>";//closes both the append div and container around this field

        //New/Updated phones section:
        formReplacement += "<p class='h4 col-12 mb-3 light-yellow-text'>New Phone #'s:</p>";
        formReplacement += "<div class='input-group col-6'><div class='input-group-prepend'><span class='input-group-text' >New Mobile #:</span></div>";
        var mobile_disp = (ADinfo['MOBILEPHONE'] ? ADinfo['MOBILEPHONE'].trim() : '');
        formReplacement += "<input name='newMobileNumber' type='tel' pattern='[\(]*[0-9]{3}[\)\-\.]*[0-9]{3}[\-\.]*[0-9]{4}' value='" + mobile_disp + "' class='form-control phoneNumber-entry' aria-label='Desired Mobile Phone Number' maxlength='20'></div>";//closes both the append div and container around this field
        //regex pattern requires that the phone number meet the format (555)-555-5555 || 555-555-5555 || 555.555.5555 or some similarly valid 10 digit number with optional '(', '-', '.' separating characters

        formReplacement += "<div class='input-group col-6'><div class='input-group-prepend'><span class='input-group-text' >New Office #:</span></div>";
        var telephone_disp = (ADinfo['TELEPHONE'] ? ADinfo['TELEPHONE'].trim() : '');
        formReplacement += "<input name='newOfficeNumber' type='tel' pattern='[\(]*[0-9]{3}[\)\-\.]*[0-9]{3}[\-\.]*[0-9]{4}' value='" + telephone_disp + "'class='form-control phoneNumber-entry' aria-label='Desired Office Phone Number' maxlength='20'></div>";//closes both the append div and container around this field
        //regex pattern requires that the phone number meet the format (555)-555-5555 || 555-555-5555 || 555.555.5555 or some similarly valid 10 digit number with optional '(', '-', '.' separating characters

        formReplacement += "<div class='col-12 mt-3 action-buttons-group'><button type='button' class='btn col-4 action-blue new-number-submit-btn'> Submit</button>";
        formReplacement += "<button type='button' class='btn col-4 btn-light cancel-btn'> Cancel</button></div>";
        $('.phoneNumberEntry-form').html(formReplacement);//we are swapping out the editable lcsoID input, with some view-only fields and the ability to input our desired updated phone number

        //Turn on an event listener for the submit button we just created: (Use a PSEUDOFORM factory function)
        $('.phoneNumberEntry-form .new-number-submit-btn').click(function () {
            if (updateADphone.validityCheck()) {//check that the form meets validity check before submitting
                var lcsoID = $('input[name=lcsoID]').val();
                updateADphone.submit();//POST data to start the batch Powershell script server-side which updates the AD phone number
                var newMobileNumber = $('input[name=newMobileNumber]').val();
                var newOfficeNumber = $('input[name=newOfficeNumber]').val();
                phonenumbers.PingboardSetMobilePhone(lcsoID, newMobileNumber, newOfficeNumber);//execute the function that actually
                navigation.load('/mobilephones/page/phoneNumberEntry.php', { loadTimeout: 500, reinitialize: phonenumbers }).setActive('adminPage');//dependency on NAVIGATION object
                notification.toast('#material-toast-bottom-right', 'Updating phone numbers for ' + lcsoID, '<i class="fas fa-clipboard-list fa-lg"></i>');//dependency on notification object methods (in meta.js)
            }
        });
        //And an event lister for the cancel button
        $('.phoneNumberEntry-form .cancel-btn').click(function () {
            navigation.load('/mobilephones/page/phoneNumberEntry.php', { loadTimeout: 500, reinitialize: phonenumbers }).setActive('adminPage');//dependency on NAVIGATION object
        });
    }//end: currentPhoneNumbers callback function

    phonenumbers.historyCallback = function (serverRes) {
        //should have a html to display regarding results from a database query for the top 100 mobile phone edits made via this web app
        $('#side-modal .modal-title').html('Recent Edits');//set modal title | utilizing the standard side modal from /meta/inc/modals.php
        $('#side-modal .modal-body').html(serverRes);
        $('#side-modal').modal('show');
    }

    phonenumbers.PingboardGetMobilePhone = function (lcsoID, waitTime) {
        phonenumbers.lookupFailures = 0;//since we are trying again, to get that data
        /* DEPRECATED: no longer need to pre-negotiate an APItoken, that is handled at each API call server-side
        //since this is a call to the Pingboard API, we need the token (might be waiting on it still)
        if (!waitTime) {
            waitTime = 1000;//sets default if unspecified
        }
        if (!phonenumbers.APItoken) {
            setTimeout(function () { phonenumbers.PingboardGetMobilePhone(waitTime + 1000 + (Math.random() * 2000 - 1000)) }, waitTime);//try again in incrementing time period, with some randomness so we don't hit the same increment as what is happening on getToken's timeout pattern
            return;//quit for now, will try again in a few secs
        }*/
        $.post('/mobilephones/act/requestPingboardUser.php',
            { lcsoID: phonenumbers.activePingboardUser.lcsoID},
            null);//simple request to start the userLookup process via Pingboard API (no callback), we will get the resulting user data via getPBUser.php asynchronously (tries a lookup every 1 sec till successful)
        setTimeout(function () {
            $.get('/mobilephones/act/getPBUser.php', { lcsoID: lcsoID }, phonenumbers.PingboardLookup);
        }, 1000);//wait 1 sec before we check for the results.
    }//end: PingboardGetMobilePhone method

    phonenumbers.PingboardLookup = function (serverRes) {
        //A successful getPBUser will callback here, or be looped to try again (if still waiting on a result from requestPingboardUser server-side)

        try {
            serverRes = JSON.parse(serverRes);
        } catch (error) {
            $('input[name=PingboardMobileNumber]').val('PINGBOARD LOOKUP FAILED');//set the disabled (view-only) value in display
            $('input[name=PingboardOfficeNumber]').val('PINGBOARD LOOKUP FAILED');//set the disabled (view-only) value in display
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
        if (serverRes.success) {
            var userData = JSON.parse(serverRes.userData);//there was another json-encoded user data object in this result, parse it before you try to use it!

            if (userData.length > 0) {//did we find a user that matches this lcso #?
                userData = userData[0];//Note: The users array which is returned has potentially multiple users in it, but to match a LCSO # this should be unique(only one returned user realistically), but this is why there is an index[0] there, to get the first result in the set
                if (userData) {
                    var mobilePhone = userData["phone"];
                    var officePhone = userData["office_phone"];
                    //If there wasn't a value in that slot, it will be null; provide defaults in this case
                    if (!mobilePhone) mobilePhone = 'NO MOBILE NUMBER IN PINGBOARD';
                    if (!officePhone) officePhone = 'NO OFFICE NUMBER IN PINGBOARD';
                    phonenumbers.activePingboardUser.pingboardID = userData["id"];//stored for use in subsequent API calls
                } else {
                    mobilePhone = 'NO PINGBOARD ACCOUNT';//if there was no user data returned from the Pingboard server, apparently they don't exist as a user in Pingboard yet.
                    officePhone = 'NO PINGBOARD ACCOUNT';
                }
            } else {
                mobilePhone = 'NO PINGBOARD ACCOUNT';//if there was no user data returned from the Pingboard server, apparently they don't exist as a user in Pingboard yet.
                officePhone = 'NO PINGBOARD ACCOUNT';
            }
            //Now load the values into the read-only (disabled) inputs for user feedback:
            $('input[name=PingboardMobileNumber]').val(mobilePhone);//set the disabled (view-only) value in display
            $('input[name=PingboardOfficeNumber]').val(officePhone);//set the disabled (view-only) value in display
        } else { //the request failed, so we need to try again in incrementally longer wait times
            var lcsoID = serverRes.lcsoID;//the getPBUser returns the lcsoID # it was attempting to find the matching userData lookup file 
            phonenumbers.lookupFailures++;//increment the lookup failures, we will only re-attempt 5 times with incremental backoff
            if (phonenumbers.lookupFailures < 6) {
                setTimeout(function () { $.get('/mobilephones/act/getPBUser.php', { lcsoID: lcsoID }, phonenumbers.PingboardLookup); }, phonenumbers.lookupFailures * 1000);//try again (in 1 second) to get Pingboard user data if that attempt failed
            } else {
                $('input[name=PingboardMobileNumber]').val('PINGBOARD LOOKUP FAILED');//set the disabled (view-only) value in display
                $('input[name=PingboardOfficeNumber]').val('PINGBOARD LOOKUP FAILED');//set the disabled (view-only) value in display
                console.log('Pingboard lookup timed out...');//so we can debug if the JSON parse fails
            }
        }
    }//end: PingboardLookup method

    phonenumbers.PingboardSetMobilePhone = function (lcsoID, newMobileNumber, newOfficeNumber) {
        //since this is a call to the Pingboard API, we need the token (might be waiting on it still)
        /* DEPRECATED: no longer need to pre-negotiate an APItoken, that is handled at each API call server-side
        if (!waitTime) {
            waitTime = 1000;//sets default if unspecified
        }
        if (!phonenumbers.APItoken) {
            setTimeout(function () { phonenumbers.PingboardSetMobilePhone(newMobileNumber, newOfficeNumber, waitTime + 1000 + (Math.random() * 2000 - 1000)) }, waitTime);//try again in incrementing time period, with some randomness so we don't hit the same increment as what is happening on getToken's timeout pattern
            return;//quit for now, will try again in a few secs
        }*/
        $.post('/mobilephones/act/updatePBMobilePhone.php',
            {lcsoID: lcsoID, newMobileNumber: newMobileNumber, newOfficeNumber: newOfficeNumber },
            null);//simple request to start the updateUser process via Pingboard API (no callback)
    }//end: PingboardSetMobilePhone method

    return phonenumbers;//return what we built
}
/****************************************************************************PHONENUMBERS: Factory Function*****/
