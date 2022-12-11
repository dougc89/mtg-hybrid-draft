//Civil History remake:
function CivilAppOldest() {//LCSO remake from Hutson WinCivil data circa 2000-2006
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
            $('.search-receipts').attr('href', '/civilsoftware/apps/civil_oldest/' + qryString);//define the querystring on that action link
        });


        $('a.receipt-details').click(function () {
            var receiptID = $(this).attr('data-receiptID');
            //DEV ONLY//console.log($(this).attr('data-receiptID'));
            navigation.load('/civilsoftware/apps/civil_oldest/page/receiptDetails.php?receiptID=' + receiptID, { loadTimeout: 500, reinitialize: civilApp });
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
            navigation.load('/civilsoftware/apps/civil_oldest/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });

        $('table.receipt-summary').DataTable({
            pageLength: 25,
            order: [[0, "desc"], [2, "desc"]]//1: sort by hidden yyyy-mm-dd date; 2: receipt number
        });//when viewing all civil receipts
    }//end:initialize///////////////////////

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


    civilApp.prepareNamesSection = function (serverRes) {//This function can be run when intializing the page, or after updating the names section content
        //Load the server response (html) into the names section: (if applicable)
        if (serverRes) $('.names-section').html(serverRes);
        //Turn on event listeners in newly created content:

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
                    $.get('/civilsoftware/apps/civil_oldest/act/getServedTab.php', { receiptID: receiptID, servedID: servedID }, civilApp.prepareServedTab);
                    $.get('/civilsoftware/apps/civil_oldest/act/getCommentsTab.php', { receiptID: receiptID, servedID: servedID }, civilApp.prepareCommentsTab);
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

        $('.tab-content.served .close-btn').click(function () {
            navigation.load('/civilsoftware/apps/civil_oldest/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });

    }//end: prepareServedTab

    civilApp.prepareCommentsTab = function (serverRes) {//This function can be run when intializing the page, or after updating the served tab content
        //Load the server response (html) into the served tab: (if applicable)
        if (serverRes) $('.tab-content.comments').html(serverRes);
        //Turn on event listeners in newly created content:
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
            navigation.load('/civilsoftware/apps/civil_oldest/page/receiptSummary.php', { loadTimeout: 250, reinitialize: civilApp });
        });
    }//end: prepareServedTab

    return civilApp;
}
/****************************************************************************CivilApp: Factory Function*****/