/*****CivilApp: Factory Functions****************************************************************************/
/*There are 3 versions of this factory function (nearly the same) for the old, older, and oldest versions of this Civil software.
 * Legacy titles:
 * WinCivil >> CivilApp
 * Civil Process >> CivilAppOlder
 * Civil History >> CivilAppOldest
 * RETURN: All 3 will return an object called civilApp, but with some potentially different mappings (such as GET/POST urls)
 */
//WinCivil remake:
function CivilApp() {//LCSO remake from Hutson WinCivil data
    var civilApp = {};//we will build this
    civilApp.tabSaved = {
        receipt: false,
        served: false,
        comments: false
    };//this object keeps track of the saved status on separate tabs, in order to notify the user when the save is complete (or any errors encountered)
    civilApp.nameToRemove = null;//temp slot to hold the WinCivil.Served['UniqueID'] to remove
    civilApp.activeReceipt = null;//used for the #remove-name-modal, but we may find other uses for this
    civilApp.searchFilter = null;//used to prefill (or recall) the search filter on the datatable of receiptSummary
    civilApp.activeAttorney = null;//keeps track of the attorney (their uniqueID "Code") we have active: for saving attorneyInfo

    civilApp.initialize = function () {
   
        //We have to initialize every datepicker separate, otherwise they will sync values!
        $('.tab-content.receipt input[name=ReceiveDate]:enabled').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('.tab-content.receipt input[name=RefundDate]:enabled').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('.date-search input[name=MinDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        $('.date-search input[name=MaxDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });

        //Define an href on the search link by the values in the .date-search fields:
        //DEPRECATED//$('.search-receipts').click(function () {
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
            //console.log('/civilsoftware/apps/civil/' + qryString);
            //DEPRECATED//window.open('/civilsoftware/apps/civil/' + qryString, '_self');//loads this page fresh using those querystring values defined by start/end dates
            $('.search-receipts').attr('href', '/civilsoftware/apps/civil/' + qryString);//define the querystring on that action link
            //DEPRECATED//a modal date range selector has been provided for this report //$('.nav-item.dropdown .open-report--ledger').attr('href', '/civilsoftware/apps/civil/page/report/ledger.php' + qryString);//define the querystring on that action link

        });


        $('.new-receipt').click(function () {
            if (!$(this).hasClass('waiting')) {
                var type = $(this).attr('data-type');//should be 'new_paid' or 'new_freebie'
                $('.new-receipt').addClass('waiting');//we will attach the .waiting class to BOTH new buttons, and remove it on callback, to prevent duplicate actions
                //Resets the activeAttorney
                civilApp.activeAttorney = 'new';
                $.post('/civilsoftware/apps/civil/act/addReceipt.php', { add: type }, civilApp.receiptAdded);//url, data, callback
            }
        });

        $('a.receipt-details').click(function () {
            var receiptID = $(this).attr('data-receiptID');
            //Show the print receipt and return reports, since we are opening a specific the receipt (hide the general report)
            $('.nav-item.dropdown .open-report--ledger').addClass('d-none');
            $('.nav-item.dropdown .open-report--DOR_billing').addClass('d-none');
            $('.nav-item.dropdown .open-report--civil-code').addClass('d-none');
            $('.nav-item.dropdown .open-report--receipt').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/receipt.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt
            //Resets the activeAttorney
            civilApp.activeAttorney = 'new';
            //$('.nav-item.dropdown .open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/return.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt
            navigation.load('/civilsoftware/apps/civil/page/receiptDetails.php?receiptID=' + receiptID, { loadTimeout: 500, reinitialize: civilApp });
        });

        $('a.receipt-served-details').click(function () {
            /*allows you to navigate to that receipt details, specific to the name of service you clicked on*/
            var receiptID = $(this).attr('data-receiptID');
            var servedID = $(this).attr('data-servedID');
            //Show the print receipt and return reports, since we are opening a specific the receipt (hide the general report)
            $('.nav-item.dropdown .open-report--ledger').addClass('d-none');
            $('.nav-item.dropdown .open-report--DOR_billing').addClass('d-none');
            $('.nav-item.dropdown .open-report--civil-code').addClass('d-none');
            $('.nav-item.dropdown .open-report--receipt').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/receipt.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt
            //Resets the activeAttorney
            civilApp.activeAttorney = 'new';
            //$('.nav-item.dropdown .open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/return.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt
            navigation.load('/civilsoftware/apps/civil/page/receiptDetails.php?receiptID=' + receiptID + '&servedID=' + servedID, { loadTimeout: 500, reinitialize: civilApp });
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

        $('textarea[name=Attorney]').keyup(function () {
            $('.attorney-save-btn').removeClass('d-none');//show the button if the user edits the attorney info
        });

        $('.attorney-save-btn').click(function () {
            var attorneyInfo = $('textarea[name=Attorney]').val();//get the current value from the attorney textarea 
            if (attorneyInfo != '') {//submit this attorneyInfo along with the attorneyCode that we had saved in activeAttorney property
                $.post('/civilsoftware/apps/civil/act/saveAttorney.php', {attorneyInfo: attorneyInfo, attorneyCode: civilApp.activeAttorney}, civilApp.attorneySaved);//url, data, callback
                $(this).addClass('d-none');//hide the save button, so that you cannot spam click it... the button unhides again if you type in the attorney textarea (on keyup)
            }
        });

        $('.tab-content.receipt .save-btn').click(function () {
            civilApp.saveAllTabs(true);//calls a helper function, with user feedback on the required fields
        });

        $('.tab-content.receipt .close-btn').click(function () {
            navigation.load('/civilsoftware/apps/civil/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
            //Hide the print receipt and return reports, since we are closing out the receipt (no longer relevant)
            $('.nav-item.dropdown .open-report--ledger').removeClass('d-none');
            $('.nav-item.dropdown .open-report--DOR_billing').removeClass('d-none');
            $('.nav-item.dropdown .open-report--civil-code').removeClass('d-none');
            $('.nav-item.dropdown .open-report--receipt').addClass('d-none');
            $('.nav-item.dropdown .open-report--return').addClass('d-none');
        });

        // second party verification that the receipt was filled out correctly
        $('.tab-content.receipt .verify-btn').click(async function () {
            var receiptID = $('.tab-content.receipt input[name=UniqueID]').val()
            console.log('verifying', receiptID)
            let response = await $.post('/civilsoftware/apps/civil/act/secondPartyVerify.php', {receiptID: receiptID})
            console.log(response);
            $('.tab-content.receipt .verify-btn-group').addClass('d-none');
            $('.tab-content.receipt .verify-zone').removeClass('d-none').html('2nd Party Verified by ' + JSON.parse(response)['success']['verified_by']);
        });

        $('.tab-content.receipt .new-name-btn').click(function () {//a copy of this exists in the names section and on the receipt tab
            var receiptID = $(this).attr('data-receiptID');
            $.post('/civilsoftware/apps/civil/act/addName.php', { receiptID: receiptID }, civilApp.nameAdded);
        });

        $('.add-new-server--btn').click(function () {
            if (newServerForm.validityCheck()) newServerForm.submit();
        });

        $('.edit-server-btn').click(function () {
            $(this).parents('.server-info').addClass('d-none');//hide the view-only row this resides in
            var serverID = $(this).attr('data-serverID');//the target editing row
            $('.modify-server-container--' + serverID).removeClass('d-none');//show the editing row
        });//opens the input fields associated with editing

        $('.modify-server--btn').click(function () {
            var data = {};//intialize data object for POST values
            var parentContainer = $(this).parents('.modify-server-container');//the inputs we want to submit are children of this container
            data.serverID = $(this).attr('data-serverID');//the target event to modify in the db
            data.lcsoID = parentContainer.find('input[name=lcsoID]').val();//there are other inputs with this name, but only one in the associated container
            data.displayName = parentContainer.find('input[name=displayName]').val();//there are other inputs with this name, but only one in the associated container
            data.email = parentContainer.find('input[name=email]').val();//there are other inputs with this name, but only one in the associated container

            if (data.serverID && data.displayName && data.displayName != '') {//check for some validity before posting
                //console.log(data);
                $.post('/civilsoftware/apps/civil/act/updateServer.php', data, civilApp.serversModified);//url, data, callback
            } else {
                //console.log(parentContainer);
                //console.log(data);
            }
        });//submits to modify server info

        $('.remove-server--btn').click(function () {
            if ($(this).hasClass('confirm')) {//this is the second time that we clicked the remove button, so the action is confirmed
                var serverID = $(this).attr('data-serverID');
                //DEV/console.log('going to try and remove ' + serverID);
                $.post('/civilsoftware/apps/civil/act/removeServer.php', { serverID: serverID }, civilApp.serversModified);//url, data, callback 
            } else {
                $(this).addClass('confirm');//slide the button into it's confirm mode (click again to confirm)
            }
            setTimeout(function (thisBtn) {
                thisBtn.removeClass('confirm');
            }, 3000, $(this));//give the user 3 seconds to click confirm, then remove the confirm class and make them start over with that double-click

        });

        var receiptTable = $('table.receipt-summary').DataTable({
            pageLength: 25,
            order: [[0, "desc"], [1, "desc"]],//1: sort by hidden yyyy-mm-dd date; 2: receipt number
            columnDefs: [
                { "orderable": false, "targets": [3, 4] }
            ]
        });//datatable when viewing all civil receipts
        var searchBar = $('.dataTables_wrapper input[type=search]');
        if (civilApp.searchFilter) {//if we have a prefilled searchFilter to use
            receiptTable.search(civilApp.searchFilter).draw();//using DataTable methods, apply a search to the table programatically (search is the input text to filter by, draw method redraws the table)
            //technically, the table doesn't automatically apply a search from getting input value put into its search bar (as it needs a keyup to trigger the redraw)
            searchBar.val(civilApp.searchFilter);//but we are inserting the filter text where the user can see it, implying that they can change what it and see that the table responds to their input
        }
        searchBar.keyup(function () {
            civilApp.searchFilter = $(this).val();//continuously store the typed search filter, so that it reloads if we return to this receiptSummary view
        });
    }//end:initialize///////////////////////

    civilApp.saveAllTabs = function (showFeedback) {
        if (receiptForm.validityCheck(false) && servedForm.validityCheck(false)) {//only checking validity on the main receipt tab (only showing feedback if saved from the receipt tab)
            civilApp.tabSaved['receipt'] = false;//waiting to hear back before notifying user of successful save
            civilApp.tabSaved['served'] = false;//waiting to hear back before notifying user of successful save
            civilApp.tabSaved['comments'] = false;//waiting to hear back before notifying user of successful save
            receiptForm.submit();//initialized this form in funcs.php
            servedForm.submit();//initialized this form in funcs.php
            commentsForm.submit();//initialized this form in funcs.php
        } else if (!receiptForm.validityCheck()) {
            //show relevant feedback based on where the error(s) exist | we didn't show feedback before so that it wouldn't occure twice
            notification.toast('#material-toast-bottom-right', 'The receipt tab needs correcting before saving...', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        } else if (!servedForm.validityCheck()) {
            notification.toast('#material-toast-bottom-right', 'The served tab needs correcting before saving...', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        }
    }//end: save all tabs 

    civilApp.historicalSearchResults = function (serverRes) {
        //DEV//console.log(serverRes);
        $('#historical-search-modal .search-results').html(serverRes.html);
        if (serverRes.success) {
            //Attach the event listeners so that you can use these results as direct links
            $('#historical-search-modal .historical-search-result').click(function () {
                /*allows you to navigate to that receipt details, specific to the name of service you clicked on*/
                var receiptID = $(this).attr('data-receiptID');
                // var servedID = $(this).attr('data-servedID');
                //Show the print receipt and return reports, since we are opening a specific the receipt (hide the general report)
                $('.nav-item.dropdown .open-report--ledger').addClass('d-none');
                $('.nav-item.dropdown .open-report--DOR_billing').addClass('d-none');
                $('.nav-item.dropdown .open-report--civil-code').addClass('d-none');
                $('.nav-item.dropdown .open-report--receipt').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/receipt.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt
                //Resets the activeAttorney
                civilApp.activeAttorney = 'new';
                //Close the search modal (leave the search results there, in case you open it back up you don't have to redo the query)
                $('#historical-search-modal').modal('hide');
                //$('.nav-item.dropdown .open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/return.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt
                navigation.load('/civilsoftware/apps/civil/page/receiptDetails.php?receiptID=' + receiptID, { loadTimeout: 500, reinitialize: civilApp });
            });
            $('#historical-search-modal .load-more').click(function () {
                var loadingSpinner = '<div class="w-100 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';
                $('#historical-search-modal .search-results').html(loadingSpinner);
                var resultLimit = parseInt($(this).attr('data-resultLimit')) + 10;//adds 10 to the current result limit
                historicalSearch.submit({ resultLimit : resultLimit });//passes this new limit (along with the current search field data) for more results
            });
        }
    }

    civilApp.attorneyResults = function (serverRes) {
        //DEV ONLY//console.log('results returned.');
        $('#attorney-finder-modal .search-results').html(serverRes);
        $('.attorney-info').click(function () {
            if ($(this).hasClass('clicked')) {//registers as a double-click
                civilApp.activeAttorney = $(this).attr('data-attorneyCode');//save the uniqueID "Code" for this attorney as the active one (so we know which record to target for saves)
                $('.attorney-save-btn').addClass('d-none');//hides the button, because we are only going to allow saving of its updated value if the user edits it
                //DEV//console.log(civilApp.activeAttorney);
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
    }//end: attorneyResults

    civilApp.attorneySaved = function (serverRes) {
        //DEV//console.log(serverRes);
        if (serverRes.attorneyCode) civilApp.activeAttorney = serverRes.attorneyCode;//set the returned value (might be a generate new code if we just inserted 'new' attorney info), so that subsequent saves while on this screen will update that record
        //DEV//console.log(civilApp.activeAttorney);
    }//end: attorneySaved

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
                $.get('/civilsoftware/apps/civil/act/getCommentsTab.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareCommentsTab);
            }
            if (serverRes.tab == 'comments') {//reload just the comments tab using specified parameters (to get most recent version)
                if (serverRes.servedID) {//only tries to reload the comments tab if it was loaded from a valid save (servedID already defined)
                    $.get('/civilsoftware/apps/civil/act/getCommentsTab.php', { receiptID: serverRes.receiptID, servedID: serverRes.servedID }, civilApp.prepareCommentsTab);
                }
            }
        } else {
            notification.toast('#material-toast-bottom-right', 'There was a problem saving the ' + serverRes.tab + ' tab', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
            console.log(serverRes);
        }
    }//end: saveNotification method

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

    civilApp.prepareNamesSection = function (serverRes) {//This function can be run when intializing the page, or after updating the names section content
        //Load the server response (html) into the names section: (if applicable)
        if (serverRes) $('.names-section').html(serverRes);
        //Turn on event listeners in newly created content:
        $('.names-section .new-name-btn').click(function () {//an instance of .new-name-btn exists within the receipt tab. We don't want to target it here (avoid redundancy)
            var receiptID = $(this).attr('data-receiptID');
            $.post('/civilsoftware/apps/civil/act/addName.php', { receiptID: receiptID }, civilApp.nameAdded);
        });

        $('.names-section .delete-name-btn').click(function () {//an instance of .new-name-btn exists within the receipt tab. We don't want to target it here (avoid redundancy)
            var activeName = $('.name-served.active');
            civilApp.nameToRemove = activeName.attr('data-servedID');
            civilApp.activeReceipt = activeName.attr('data-receiptID');
            $('#remove-name-modal .name').html(activeName.text());//to show the name we are preparing to remove
            $('#remove-name-modal').modal('show');
        });



        //Adjust the link for the return (report from top navbar) | Note: this will only hit it when enabling the Names section, we need to change it if we change the name (see below)
        var servedID = $('.name-served.active').attr('data-servedID');//get the value of the hidden input that holds the servedID that we want to attach this return report to
        if (servedID) {//this might be undefined, if we didn't actually have an active name-served
            $('.nav-item.dropdown .open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/return.php?servedID=' + servedID);//show this report, and change its href to apply to this name served
        }

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
                    $('.nav-item.dropdown .open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/return.php?servedID=' + servedID);//show this report, and change its href to apply to this name served
                    $.get('/civilsoftware/apps/civil/act/getServedTab.php', { receiptID: receiptID, servedID: servedID }, civilApp.prepareServedTab);
                    $.get('/civilsoftware/apps/civil/act/getCommentsTab.php', { receiptID: receiptID, servedID: servedID }, civilApp.prepareCommentsTab);
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

        /*
        DEPRECATED//This is now handled via the prepareNamesSection
        //Enable the return report to be printed on this served tab:
        var servedID = $('input[name=servedID]').val();//get the value of the hidden input that holds the servedID that we want to attach this return report to
        if (servedID && servedID != 'new') {
            $('.nav-item.dropdown .open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/return.php?servedID=' + servedID);//show this report, and change its href to apply to this receipt
        }
        */
        //Attach some datepickers:
        $('.tab-content.served input[name=CourtDate]:enabled').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        $('.tab-content.served input[name=DueDate]:enabled').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
 
        
        // calculate today as the max date that can be chosen for service
        let today = new Date();
        today_str = today.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        $('.tab-content.served input[name=ServeDate]:enabled').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', maxDate: today_str});

        //For shortcut modal:
        $('.served-shortcut').click(function () {
            $('#autofill-modal').modal('show');
        });

        //Turn on event listeners in newly created content:
        $('.add-attempt-btn').click(function () {
            var servedID = $(this).attr('data-servedID');
            $.get('/civilsoftware/apps/civil/act/getAttemptForm.php', { servedID: servedID }, civilApp.showAttemptModal);
        });
        $('.edit-attempt-btn').click(function () {
            var servedID = $(this).attr('data-servedID');
            var attemptID = $(this).attr('data-attemptID');
            $.get('/civilsoftware/apps/civil/act/getAttemptForm.php', { servedID: servedID, attemptID: attemptID }, civilApp.showAttemptModal);
        });
        $('.remove-attempt-btn').click(function () {
            if ($(this).hasClass('confirm')) {//this is the second time that we clicked the remove button, so the action is confirmed
                var servedID = $(this).attr('data-servedID');
                var attemptID = $(this).attr('data-attemptID');
                $.post('/civilsoftware/apps/civil/act/manageAttempts.php', { action: 'remove', ServedID: servedID, AttemptID: attemptID }, civilApp.attemptSaved);//url, data, callback 
            } else {
                $(this).addClass('confirm');//slide the button into it's confirm mode (click again to confirm)
            }
            setTimeout(function () { $('.remove-attempt-btn.confirm').removeClass('confirm'); }, 3000);//give the user 3 seconds to click confirm, then remove the confirm class and make them start over with that double-click
        });

        $('.serve-status.unlocked').change(function () {
            //DEV ONLY//console.log('changed a status');
            $.each($('.serve-status'), function (target) {
                if ($(this).prop('checked')) {
                    //DEV ONLY//console.log($(this).val() + ' is checked');
                    if ($(this).val() != 'P') {//indicates SERVED or NON-SERVED (not PENDING)

                        // attach the datepicker after selecting, but before enabling
                        $('.tab-content.served input[name=ServeDate]:not(enabled)').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });

                        // TODO: enable autofill of served date once we go live with Road tracking their own service for injunctions and ex parte.
                        // if($(this).val() != 'R' && $('.tab-content.served input[name=ServeDate]').val() == '' ){
                        //     // prefill the datepicker with today's date (mm/dd/yyyy) for served/non-served toggle only, but only if it was blank
                        //     let date = new Date()
                        //     let today = date.toLocaleDateString('en-US', {day:'2-digit', month:'2-digit', year: 'numeric'})
                        //     $('.tab-content.served input[name=ServeDate]').val(today)
                        // }

                        $('.serve-dependent').prop('disabled', false);//enable these fields to be filled
                        // $('.pending-hidden').removeClass('d-none');//enable these fields to viewed
                        $('.serve-required').prop('required', true);//require that these fields be filled before saving
                        if ($(this).val() == 'N') $('select[name=TypeService]').val('K').change();//assume the type of service is 'UNABLE TO LOCATE': Type K | manually trigger change event to get comments box to pop up
                        // Auto-populate server name in Server input (but not on changing to 'Return Completed')
                        if ($('input[name=myName]').length > 0 && $(this).val() != 'R') {
                            var myName = $('input[name=myName]').val();
                            $('select[name=Server] option[value="' + myName + '"]').prop('selected', true);
                            // console.log(myName);
                        }  

                    } else {
                        $('.serve-required').prop('required', false);
                        $('.serve-dependent').prop('disabled', true);
                    }
                } else {
                    //DEV ONLY//console.log($(this).val() + ' is not checked');
                }
            });
        });

        $('select[name=TypeService]').change(function () {
            var selected = $('select[name=TypeService] option:selected');
            if ($(this).val() == 'A') {//This is a service to the individual named.
                var firstName = $('input[name=ToBeServedFirstName]').val();
                var lastName = $('input[name=ToBeServedLastName]').val();
                $('input[name=WhoWasServed]').val(firstName + ' ' + lastName);//prepopulates the name of the individual
            }
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

        $('select[name=Server]').change(function () {
            //There is a dropdown for the Deputies who serve these Civil papers. Normal users are in there already.
            //But sometimes the clerk will need to define some random other person (SRD/ROAD helping out, etc.)
            if ($(this).val() == 'freeText') {
                $('.input-group.free-text-server').removeClass('d-none');//show this free text field for Server that is normally hidden
            } else {
                $('.input-group.free-text-server').addClass('d-none');//otherwise, hide the free text Server field (not needed)
            }
        });

        $('.civil-status-toggle').click(function () {//the class .unlocked is added only if the served record has not been signed yet!
            $('.civil-status-toggle.checked').removeClass('checked');//remove that class from whichever one has it
            $(this).addClass('checked');//add it to this one
        });

        $('.tab-content.served .save-btn').click(function () {
            civilApp.saveAllTabs(false);//calls a helper function, with no user feedback on required fields (they are only required on the receipt tab)
        });

        $('.tab-content.served .close-btn').click(function () {
            navigation.load('/civilsoftware/apps/civil/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });

        $('.add-signature-btn').click(function () {
            //We need to open the eSignature-modal, with the servedID for which we are signing tagged to its hidden input
            var servedID = $(this).attr('data-servedID');
            $('#eSignature-modal input[name=servedID]').val(servedID);
            //Wipe the existing signature and checkbox:
            $('#eSignature-modal input[name=signature]').val('');
            $('#eSignature-modal #eSigConsent').prop('checked', false);
            $('#eSignature-modal').modal('show');
        });

        $('.remove-signature-btn').click(function () {
            //We need to open the eSignature-modal, with the servedID for which we are signing tagged to its hidden input
            var signatureID = $(this).attr('data-signatureID');
            var servedID = $(this).attr('data-servedID');
            //Set the values for these hidden inputs:
            $('#amend-return-modal input[name=signatureID]').val(signatureID);
            $('#amend-return-modal input[name=servedID]').val(servedID);
            //Wipe the existing reason (if applicable)
            $('#amend-return-modal textarea[name=reason]').val('');
            $('#amend-return-modal').modal('show');

            setTimeout(function () {//a timeout is needed, because the textarea is not immediately visible during the modal transition
                $('#amend-return-modal textarea[name=reason]').focus();//so that the user can go ahead and type in it
            }, 1000);

        });

        $('.request-signature-btn').click(function () {
            //We need to open the request-signature-modal with the servedID for which we are signing tagged to its hidden input
            var servedID = $(this).attr('data-servedID');
            $('#request-signature-modal input[name=servedID]').val(servedID);
            //Wipe any previous request info in the modal
            $('#request-signature-modal select[name=emailTo]').val('');
            $('#request-signature-modal .emailToAlt--container').addClass('d-none');//this should only be visible if the dropdown is set to '--Custom--'
            $('#request-signature-modal input[name=emailToAlt]').val('');
            $('#request-signature-modal').modal('show');
        });

        $('input[name=AssignedTo_filter]').on('keyup', function(e){

            // only filter on Enter key
            if(e.key == 'Enter'){
                var filter_text = $(this).val()
                const regex = new RegExp(filter_text, 'gi');
                var select = document.querySelector("select[name=AssignedTo]");

                for(var option of select.options) {
                    if (option.text.match(regex)) {
                        option.style.display = 'list-item';
                    } else {
                        option.style.display = 'none';
                    }
                }
            }
            
        })


        $('input[name=Server_filter]').on('keyup', function(e){

            // only filter on Enter key
            if(e.key == 'Enter'){
                var filter_text = $(this).val()
                const regex = new RegExp(filter_text, 'gi');
                var select = document.querySelector("select[name=Server]");

                for(var option of select.options) {
                    if (option.text.match(regex)) {
                        option.style.display = 'list-item';
                    } else {
                        option.style.display = 'none';
                    }
                }
            }
            
        })

    }//end: prepareServedTab

    civilApp.showAttemptModal = function (serverRes) {
        //this content loads into the #attempt-modal .modal-body. It is a form with any pre-existing values already inserted.
        $('#attempt-modal .modal-body').html(serverRes);
        //We just need to attach the datepicker
        $('#attempt-modal .modal-body input[name=attemptDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        //And open the modal for user input, now that it is ready:
        $('#attempt-modal').modal('show');
    }

    civilApp.attemptSaved = function (serverRes) {
        //DEV ONLY//console.log(serverRes);
        //The serverRes should be a read-only version of the attempt(s) content, to put into .attempts-section on the served tab
        try {
            //serverRes = JSON.parse(serverRes);//already a JSON object
            $('input[name=Attempts]').val(serverRes.count);
            $('.attempts-section').html(serverRes.html);
            //Attach event listeners to the included buttons (edit and remove attempts)
            $('.attempts-section .edit-attempt-btn').click(function () {
                var servedID = $(this).attr('data-servedID');
                var attemptID = $(this).attr('data-attemptID');
                $.get('/civilsoftware/apps/civil/act/getAttemptForm.php', { servedID: servedID, attemptID: attemptID }, civilApp.showAttemptModal);
            });
            $('.attempts-section .remove-attempt-btn').click(function () {
                if ($(this).hasClass('confirm')) {//this is the second time that we clicked the remove button, so the action is confirmed
                    var servedID = $(this).attr('data-servedID');
                    var attemptID = $(this).attr('data-attemptID');
                    $.post('/civilsoftware/apps/civil/act/manageAttempts.php', { action: 'remove', ServedID: servedID, AttemptID: attemptID }, civilApp.attemptSaved);//url, data, callback 
                } else {
                    $(this).addClass('confirm');//slide the button into it's confirm mode (click again to confirm)
                }
                setTimeout(function () { $('.remove-attempt-btn.confirm').removeClass('confirm'); }, 3000);//give the user 3 seconds to click confirm, then remove the confirm class and make them start over with that double-click
            });
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
    }

    civilApp.prepareCommentsTab = function (serverRes) {//This function can be run when intializing the page, or after updating the served tab content
        //Load the server response (html) into the served tab: (if applicable)
        if (serverRes) $('.tab-content.comments').html(serverRes);
        //Turn on event listeners in newly created content:
        $('.tab-content.comments .save-btn').click(function () {
            //DEV ONLY//console.log('trying to save with this button');
            civilApp.saveAllTabs(false);//calls a helper function, with no user feedback on required fields (they are only required on the receipt tab)
        });

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
            navigation.load('/civilsoftware/apps/civil/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });
    }//end: prepareCommentsTab

    civilApp.receiptAdded = function (receiptID) {
        $('.new-receipt').removeClass('waiting');//we attached the .waiting class to BOTH new buttons, and remove it on callback, to prevent duplicate actions
        //Show the print receipt and return reports, since we are opening a specific the receipt (hide the general report)
        $('.nav-item.dropdown .open-report--ledger').addClass('d-none');
        $('.nav-item.dropdown .open-report--DOR_billing').addClass('d-none');
        $('.nav-item.dropdown .open-report--civil-code').addClass('d-none');
        $('.nav-item.dropdown .open-report--receipt').removeClass('d-none').attr('href', '/civilsoftware/apps/civil/page/report/receipt.php?receiptID=' + receiptID);//show this report, and change its href to apply to this receipt

        navigation.load('/civilsoftware/apps/civil/page/receiptDetails.php?receiptID=' + receiptID, { loadTimeout: 500, reinitialize: civilApp });
    }
    civilApp.signatureAdded = function (serverRes) {//should be returning a JSON object
        console.log(serverRes);
        var signingArea = "<div class='col-8 ml-1 pt-3'><i class='fas fa-pen-nib material-light-green-text mr-1'></i><span class='cursive'>" + serverRes.signature + "</span><br>";
        signingArea += "<span class='text-muted'>" + serverRes.timestamp + "<span></div>";
        signingArea += "<button class='btn oval mt-3 col-3 mb-4 action-red remove-signature-btn' data-servedID='" + serverRes.servedID + "' data-signatureID='" + serverRes.signatureID + "' > AMEND</button > ";
        //$html.= "<div class='col-12 ml-1 mb-3 text-muted'>{$signatureTimestamp}</div>";
        $('.tab-content.served .signing-area').html(signingArea);//we are updating the signing area according to what was just signed
        $('#eSignature-modal').modal('hide');//close the modal they just used to sign with
        //Add the event listener so that the signature can be removed
        $('.remove-signature-btn').click(function () {
            //We need to open the eSignature-modal, with the servedID for which we are signing tagged to its hidden input
            var signatureID = $(this).attr('data-signatureID');
            var servedID = $(this).attr('data-servedID');
            //Set the values for these hidden inputs:
            $('#amend-return-modal input[name=signatureID]').val(signatureID);
            $('#amend-return-modal input[name=servedID]').val(servedID);
            //Wipe the existing reason (if applicable)
            $('#amend-return-modal textarea[name=reason]').val('');
            $('#amend-return-modal').modal('show');
            setTimeout(function () {//a timeout is needed, because the textarea is not immediately visible during the modal transition
                $('#amend-return-modal textarea[name=reason]').focus();//so that the user can go ahead and type in it
            }, 1000);
        });
    }//end: signatureAdded

    civilApp.signatureRemoved = function (servedID) {//should be returning the servedID for
        //DEV//console.log(servedID);
        //Unlock the inputs which would have been locked by the signature:
        $('.serve-dependent').prop('disabled', false);
        //Restore the signing buttons, so that the record can be signed again
        var signingArea = "<button class='btn oval col-3 ml-3 mb-3 action-green add-signature-btn' data-servedID='" + servedID + "'><i class='fas fa-pen-nib' title='Click to Sign'></i> SIGN</button>";
        signingArea += "<div class='col text-muted pl-3 pt-3 unselectable'>Deputy: sign off when complete.</div>";
        signingArea += "<div class='mt-2 round-btn--small position-rel action-blue request-signature-btn' title='Request Signature' data-servedID='" + servedID + "'><i class='fas absolute-center fa-envelope'></i></div>";

        $('.tab-content.served .signing-area').html(signingArea);//we are updating the signing area according to what was just signed
        $('#amend-return-modal').modal('hide');//close the modal they just used to sign with
        //Wipe the values of these inputs for reuse:
        $('#amend-return-modal input[name=reason]').val('');
        $('#amend-return-modal input[name=signatureID]').val('');
        $('#amend-return-modal input[name=servedID]').val('');
        //Add the event listener back to the addSignature button        
        $('.add-signature-btn').click(function () {
            //We need to open the eSignature-modal, with the servedID for which we are signing tagged to its hidden input
            var servedID = $(this).attr('data-servedID');
            $('#eSignature-modal input[name=servedID]').val(servedID);
            //Wipe the existing signature and checkbox:
            $('#eSignature-modal input[name=signature]').val('');
            $('#eSignature-modal #eSigConsent').prop('checked', false);
            $('#eSignature-modal').modal('show');
        });
        $('.request-signature-btn').click(function () {
            //We need to open the request-signature-modal with the servedID for which we are signing tagged to its hidden input
            var servedID = $(this).attr('data-servedID');
            $('#request-signature-modal input[name=servedID]').val(servedID);
            //Wipe any previous request info in the modal
            $('#request-signature-modal select[name=emailTo]').val('');
            $('#request-signature-modal .emailToAlt--container').addClass('d-none');//this should only be visible if the dropdown is set to '--Custom--'
            $('#request-signature-modal input[name=emailToAlt]').val('');
            $('#request-signature-modal').modal('show');
        });
    }//end: signatureRemoved

    civilApp.signatureRequested = function (serverRes) {//should be returning a JSON object
        console.log(serverRes);
        if (serverRes.success) {
            $('#request-signature-modal').modal('hide');
            notification.toast('#material-toast-bottom-right', 'Email notification sent to ' + serverRes.emailTo, '<i class="fas fa-paper-plane fa-lg"></i>');//dependency on notification object
        } else {
            notification.toast('#material-toast-bottom-right', 'Something went wrong with email notification attempt...', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        }
    }//end: signatureRequested

    civilApp.serversModified = function (serverRes) {
        //DEV//console.log(serverRes);
        navigation.load('/civilsoftware/apps/civil/page/userAdmin.php', { loadTimeout: 250, reinitialize: civilApp });
    }

    return civilApp;
}
/****************************************************************************CivilApp: Factory Function(s)*****/