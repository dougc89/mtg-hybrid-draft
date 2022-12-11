//Civil Process remake:
function CivilAppOlder() {//LCSO remake from Hutson WinCivil data circa 2007-2013
    var civilApp = {};//we will build this
    civilApp.tabSaved = {
        receipt: false,
        served: false,
        comments: false
    };//this object keeps track of the saved status on separate tabs, in order to notify the user when the save is complete (or any errors encountered)
    civilApp.nameToRemove = null;//temp slot to hold the WinCivil.Served['UniqueID'] to remove
    civilApp.activeReceipt = null;//used for the #remove-name-modal, but we may find other uses for this

    civilApp.initialize = function () {
        //We have to initialize every datepicker separate, otherwise they will sync values!
        //$('.tab-content.receipt input[name=ReceiveDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('.tab-content.receipt input[name=RefundDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('.date-search input[name=MinDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        $('.date-search input[name=MaxDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });

        //Define an href on the search link by the values in the .date-search fields:
        $('.date-search input').change(function () {
            //changing a min/max date for the search range adjusts the href in the search link:
            var startVal = $('.date-search input[name=MinDate]').val();
            var endVal = $('.date-search input[name=MaxDate]').val();
            var startQry = '';
            var endQry = '';
            if (startVal) startQry = 'start=' + startVal;
            if (endVal) endQry = 'end=' + endVal;
            var qryString = '';
            if (startVal && endVal) {//both defined
                qryString = '?' + startQry + '&' + endQry;//both exist, so concat them with '&'
            } else if (startVal || endVal) {//only one defined
                qryString = '?' + startQry + endQry;//only one of those is defined, so whatever
            }
            $('.search-receipts').attr('href', '/civilsoftware/apps/civil_older/' + qryString);//define the querystring on that action link
        });

        /*not used for this version
        $('.new-receipt').click(function () {
            if (!$(this).hasClass('waiting')) {
                var type = $(this).attr('data-type');//should be 'new_paid' or 'new_freebie'
                $('.new-receipt').addClass('waiting');//we will attach the .waiting class to BOTH new buttons, and remove it on callback, to prevent duplicate actions
                $.post('/civilsoftware/apps/civil/act/addReceipt.php', { add: type }, civilApp.receiptAdded);//url, data, callback
            }
        });
        */

        $('a.receipt-details').click(function () {
            var receiptID = $(this).attr('data-receiptID');
            //DEV ONLY//console.log($(this).attr('data-receiptID'));
            navigation.load('/civilsoftware/apps/civil_older/page/receiptDetails.php?receiptID=' + receiptID, { loadTimeout: 500, reinitialize: civilApp });
        });

        //Activate the receipt details tabs: 
        $('.tab-container .tab').click(function () {
            //toggle the active tab when clicked
            $('.tab.active').removeClass('active');
            $(this).addClass('active');
            //toggle the active tab content
            var targetContent = $(this).attr('data-tabContent');//determine which tab-content this is attached to
            $('.tab-content.active').removeClass('active');
            $('.tab-content[data-tabContent=' + targetContent + ']').addClass('active');
        });

        civilApp.prepareNamesSection();//helper function for the event listeners in .names-section | also used when reloading .names-section content
        civilApp.prepareServedTab();//ditto, for the served tab
        civilApp.prepareCommentsTab();//ditto, for the comments tab

        $('.attorney-bookmark').click(function () {
            $('#attorney-finder-modal').modal('show');
        });

        $('.tab-content.receipt .save-btn').click(function () {
            civilApp.saveAllTabs();//calls a helper function
        });

        $('.tab-content.receipt .close-btn').click(function () {
            navigation.load('/civilsoftware/apps/civil_older/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });

        /*not in use in this version
        $('.tab-content.receipt .new-name-btn').click(function () {//a copy of this exists in the names section and on the receipt tab
            var receiptID = $(this).attr('data-receiptID');
            $.post('/civilsoftware/apps/civil/act/addName.php', { receiptID: receiptID }, civilApp.nameAdded);
        });
        */
        $('table.receipt-summary').DataTable({
            pageLength: 25,
            order: [[0, "desc"], [2, "desc"]]//1: sort by hidden yyyy-mm-dd date; 2: receipt number
        });//when viewing all civil receipts
    }//end:initialize///////////////////////

    /*no editing in this version
    civilApp.saveAllTabs = function () {
        if (receiptForm.validityCheck()) {//only checking validity on the main receipt tab
            civilApp.tabSaved['receipt'] = false;//waiting to hear back before notifying user of successful save
            civilApp.tabSaved['served'] = false;//waiting to hear back before notifying user of successful save
            civilApp.tabSaved['comments'] = false;//waiting to hear back before notifying user of successful save
            receiptForm.submit();//initialized this form in funcs.php
            servedForm.submit();//initialized this form in funcs.php
            commentsForm.submit();//initialized this form in funcs.php
        } else {
            notification.toast('#material-toast-bottom-right', 'The receipt tab needs correcting before saving...', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
            console.log('save attempt rejected - validity issues');//DEV ONLY//
        }
    }//end: save all tabs 
    */

    civilApp.attorneyResults = function (serverRes) {
        //DEV ONLY//console.log('results returned.');
        $('#attorney-finder-modal .search-results').html(serverRes);
        $('.attorney-info').click(function () {
            if ($(this).hasClass('clicked')) {//registers as a double-click
                var attorneyInfo = $(this).text();//get the text content of what was selected
                $("textarea[name=Attorney]").val(attorneyInfo);
                $('#attorney-finder-modal').modal('hide');//close the modal
                //Reset the modal areas:
                $('#attorney-finder-modal select[name=shortcut]').val('0');//reset this shortcut dropdown
                $('#attorney-finder-modal input[name=searchField]').val('');//reset this search field input
                $('#attorney-finder-modal .search-results').html('');//remove all the search results
            } else {
                $(this).addClass('clicked');//if another click occurs within 0.5 secs it will register as a double-click
                window.setTimeout(function () { $('.attorney-info.clicked').removeClass('clicked') }, 500);//removed the clicked flag after 
            }
        });
        //attach event listeners such that if you click on an attorney you fill the field with their info
    }

    /*No editing in this version
    civilApp.saveNotification = function (serverRes) {
        //DEV ONLY//console.log(serverRes);
        try {
            serverRes = JSON.parse(serverRes);
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
        if (serverRes.success) {
            civilApp.tabSaved[serverRes.tab] = true;//registers that the indicated tab has saved
            if (civilApp.tabSaved['receipt'] && civilApp.tabSaved['served'] && civilApp.tabSaved['comments']) {
                //only notifies if all 3 tabs have been saved:
                notification.toast('#material-toast-bottom-right', 'Saved successfully.', '<i class="fas fa-check-circle fa-lg"></i>');//dependency on notification object
            }
            if (serverRes.tab == 'served') {//in this case, reload the names section with specified parameters (based on possible changes)
                $.get('/civilsoftware/apps/civil/act/getNamesSection.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareNamesSection);
                $.get('/civilsoftware/apps/civil/act/getServedTab.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareServedTab);
            }
            if (serverRes.tab == 'comments') {//reload just the comments tab using specified parameters (to get most recent version)
                $.get('/civilsoftware/apps/civil/act/getCommentsTab.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareCommentsTab);
            }
        } else {
            notification.toast('#material-toast-bottom-right', 'There was a problem saving the ' + serverRes.tab + ' tab', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
            console.log(serverRes);
        }
    }//end: saveNotification method
    */
    /*No editing in this version
    civilApp.nameAdded = function (serverRes) {
        //@serverRes: JSON-encoded object | ['success'=>$success, 'receiptID'=>$receiptID, 'servedID'=>$newIndex]
        //DEV ONLY//console.log(serverRes);
        try {
            serverRes = JSON.parse(serverRes);
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
        if (serverRes.success) {
            $('.tab').removeClass('active');//remove the active tab (whatever it is)
            $('.tab[data-tabContent=served]').addClass('active');//set the active tab to served
            $('.tab-content').removeClass('active');//remove the active tab content (whatever it is)
            $('.tab-content.served').addClass('active');//set the active tab content to served
            $.get('/civilsoftware/apps/civil/act/getNamesSection.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareNamesSection);
            $.get('/civilsoftware/apps/civil/act/getServedTab.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareServedTab);
            $.get('/civilsoftware/apps/civil/act/getCommentsTab.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareCommentsTab);
        }
    }
    */
    /*No editing in this version
    civilApp.nameRemoved = function (serverRes) {
        //@serverRes: JSON-encoded object | ['success'=>$success, 'receiptID'=>$receiptID, 'servedID'=>$newIndex]
        //DEV ONLY//console.log(serverRes);
        try {
            serverRes = JSON.parse(serverRes);
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
        if (serverRes.success) {
            $('.tab').removeClass('active');//remove the active tab (whatever it is)
            $('.tab[data-tabContent=receipt]').addClass('active');//set the active tab to main receipt
            $('.tab-content').removeClass('active');//remove the active tab content (whatever it is)
            $('.tab-content.receipt').addClass('active');//set the active tab content to main receipt
            $.get('/civilsoftware/apps/civil/act/getNamesSection.php', { receiptID: serverRes.receiptID }, civilApp.prepareNamesSection);
            $.get('/civilsoftware/apps/civil/act/getServedTab.php', { receiptID: serverRes.receiptID }, civilApp.prepareServedTab);
            $.get('/civilsoftware/apps/civil/act/getCommentsTab.php', { receiptID: serverRes.receiptID }, civilApp.prepareCommentsTab);
        }
        $('#remove-name-modal').modal('hide');//close that modal
        civilApp.nameToRemove = null;
    }
    */
    civilApp.prepareNamesSection = function (serverRes) {//This function can be run when intializing the page, or after updating the names section content
        //Load the server response (html) into the names section: (if applicable)
        if (serverRes) $('.names-section').html(serverRes);
        //Turn on event listeners in newly created content:
        /*No editing in this version
        $('.names-section .new-name-btn').click(function () {//an instance of .new-name-btn exists within the receipt tab. We don't want to target it here (avoid redundancy)
            var receiptID = $(this).attr('data-receiptID');
            $.post('/civilsoftware/apps/civil/act/addName.php', { receiptID: receiptID }, civilApp.nameAdded);
        });
        */
        /*No editing in this version
        $('.names-section .delete-name-btn').click(function () {//an instance of .new-name-btn exists within the receipt tab. We don't want to target it here (avoid redundancy)
            var activeName = $('.name-served.active');
            civilApp.nameToRemove = activeName.attr('data-servedID');
            civilApp.activeReceipt = activeName.attr('data-receiptID');
            $('#remove-name-modal .name').html(activeName.text());//to show the name we are preparing to remove
            $('#remove-name-modal').modal('show');
        });
        */
        //Double-click a name served to toggle to that name:
        $('.name-served').click(function () {
            if (!$(this).hasClass('active')) {//if the name is not already active
                if ($(this).hasClass('clicked')) {//registers as a double-click
                    $('.name-served.active').removeClass('active');//turn off the other active name
                    //Toggle the active tab/content to served:
                    $('.tab').removeClass('active');//remove the active tab (whatever it is)
                    $('.tab[data-tabContent=served]').addClass('active');//set the active tab to served
                    $('.tab-content').removeClass('active');//remove the active tab content (whatever it is)
                    $('.tab-content.served').addClass('active');//set the active tab content to served
                    $(this).addClass('active');//turn on this active name
                    var receiptID = $(this).attr('data-receiptID');
                    var servedID = $(this).attr('data-servedID');
                    $.get('/civilsoftware/apps/civil_older/act/getServedTab.php', { receiptID: receiptID, servedID: servedID }, civilApp.prepareServedTab);
                    $.get('/civilsoftware/apps/civil_older/act/getCommentsTab.php', { receiptID: receiptID, servedID: servedID }, civilApp.prepareCommentsTab);
                } else {
                    $(this).addClass('clicked');//if another click occurs within 0.5 secs it will register as a double-click
                    window.setTimeout(function () { $('.name-served.clicked').removeClass('clicked') }, 500);//removed the clicked flag after 
                }
            }
        });//end: double-click listener for toggling names served
    }//end: prepareNamesSection

    civilApp.prepareServedTab = function (serverRes) {//This function can be run when intializing the page, or after updating the served tab content
        //Load the server response (html) into the served tab: (if applicable)
        if (serverRes) $('.tab-content.served').html(serverRes);
        //Attach some datepickers:
        //$('.tab-content.served input[name=CourtDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('.tab-content.served input[name=ServeDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });

        //For shortcut modal:
        $('.served-shortcut').click(function () {
            $('#autofill-modal').modal('show');
        });

        /*No editing in this version
        //Turn on event listeners in newly created content:
        $('.tab-content.served .save-btn').click(function () {
            //DEV ONLY//console.log('trying to save with this button');
            civilApp.saveAllTabs();//calls a helper function
        });
        */
        /*Inputs are disabled in this version
        $('.serve-status').change(function () {
            //DEV ONLY//console.log('changed a status');
            $.each($('.serve-status'), function (target) {
                if ($(this).prop('checked')) {
                    //DEV ONLY//console.log($(this).val() + ' is checked');
                    if ($(this).val() != 'P') {//indicates SERVED or NON-SERVED (not PENDING)
                        $('.serve-dependent').prop('disabled', false);
                    } else {
                        $('.serve-dependent').prop('disabled', true);
                    }
                } else {
                    //DEV ONLY//console.log($(this).val() + ' is not checked');
                }
            });
        });
        */
        /*Inputs are disabled in this version
        $('select[name=TypeService]').change(function () {
            var selected = $('select[name=TypeService] option:selected');
            if (selected.attr('data-showServed') == 'T') {
                $('.show-served').removeClass('d-none');
            } else {
                $('.show-served').addClass('d-none');
            }

            if (selected.attr('data-showTitle') == 'T' || selected.attr('data-showRelationship') == 'T') {
                if (selected.attr('data-showTitle') == 'T') $('span.title-text').html('Title:');
                if (selected.attr('data-showRelationship') == 'T') $('span.title-text').html('Relationship:');
                $('.show-title').removeClass('d-none');
            } else {
                $('.show-title').addClass('d-none');
            }

            if (selected.attr('data-showFreeText') == 'T') {
                $('.show-comments').removeClass('d-none');
            } else {
                $('.show-comments').addClass('d-none');
            }
        });
        */
        /*Inputs are disabled in this version
        $('.civil-status-toggle').click(function () {
            $('.civil-status-toggle.checked').removeClass('checked');//remove that class from whichever one has it
            $(this).addClass('checked');//add it to this one
        })
        */
        $('.tab-content.served .close-btn').click(function () {
            navigation.load('/civilsoftware/apps/civil_older/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });
    }//end: prepareServedTab

    civilApp.prepareCommentsTab = function (serverRes) {//This function can be run when intializing the page, or after updating the served tab content
        //Load the server response (html) into the served tab: (if applicable)
        if (serverRes) $('.tab-content.comments').html(serverRes);
        //Turn on event listeners in newly created content:
        /*No editing in this version
        $('.tab-content.comments .save-btn').click(function () {
            //DEV ONLY//console.log('trying to save with this button');
            civilApp.saveAllTabs();//calls a helper function
        });
        */
        //Determine whether to show a check or not in the tab header 
        if (//multi-line conditions:
            $('.tab-content.comments textarea[name=GeneralComments]').text().length > 0 ||
            $('.tab-content.comments textarea[name=ConfidentialComments]').text().length > 0
        ) {
            //DEV ONLY//console.log('comments found, showing indicator');
            $('.tab[data-tabContent=comments] i').removeClass('d-none');//remove the display:none class, showing it
        } else {//hide the checked icon
            //DEV ONLY//console.log('no comments found, hiding indicator');
            $('.tab[data-tabContent=comments] i').addClass('d-none');//add the display:none class, hiding it
        }

        $('.tab-content.comments .close-btn').click(function () {
            navigation.load('/civilsoftware/apps/civil_older/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });
    }//end: prepareServedTab

    /*No editing in this version
    civilApp.receiptAdded = function (receiptID) {
        $('.new-receipt').removeClass('waiting');//we attached the .waiting class to BOTH new buttons, and remove it on callback, to prevent duplicate actions
        //DEV ONLY//console.log(receiptID);
        navigation.load('/civilsoftware/apps/civil/page/receiptDetails.php?receiptID=' + receiptID, { loadTimeout: 500, reinitialize: civilApp });
    }
    */
    return civilApp;
}
/****************************************************************************CivilApp: Factory Function*****/