/*****CivilLevy: Factory Function****************************************************************************/
function CivilLevy() {//LCSO remake from Hutson WinLevy data
    var civilLevy = {};//we will build this
    civilLevy.activeID = null;//the LevyUID of the one being edited (used for modal forms such as receipts)
    civilLevy.active = {};/*intialize an object that can hold all the relevant values of an active levy 
                         *i.e.civilLevy.active.plaintiff would be the plaintiff for that active levy
                         *This is filled by reading the pre-filled input fields when editing a levy, 
                         * then updated onchange of any of those input fields.
                         * When the levy is saved, we just post this entire */
    //DEPRECATED civilLevy.newLevy = false;//default, set this to true only while actively inputing a new levy, as it directs the submitted civilLevy.active data to a different action page
    civilLevy.tabSaved = {};//an object that records the tabs as being saved (so we ensure all 8 save before notified user of success)
    civilLevy.prefilter = 'OPEN';//the value we want the levySummary datatable to be prefiltered by


    civilLevy.initialize = function () {
        /////Initialize datepicker fields://////
        // Note: you have to run this executions separately, or else the date will bind to all the fields simulaneously!
        $('.tab-content.case input[name=ReceiveDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        /*There is no need to search by date, there are only ~250 of these from the past 13 years...!
        $('.date-search input[name=MinDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        $('.date-search input[name=MaxDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
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
            //DEPRECATED//window.open('/civilsoftware/apps/civil/' + qryString, '_self');//loads this page fresh using those querystring values defined by start/end dates
            $('.search-levies').attr('href', '/civilsoftware/apps/levy/' + qryString);//define the querystring on that action link
            $('.nav-item.dropdown .open-report--ledger').attr('href', '/civilsoftware/apps/levy/page/report/ledger.php' + qryString);//define the querystring on that action link

        });
        */
        //Property Tab datepickers:
        $('#newLevy-modal input[name=ReceiveDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome',/*modal: true*/ });
        $('input[name=JudgmentDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('input[name=WritDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('input[name=LevyDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('input[name=AdvertiseDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('input[name=SaleDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('input[name=SatisfyDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('input[name=CloseDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });

        //Intest Tab datepickers, removed at request of Mimi Williams
        //$('input[name=J1FromDate0]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1FromDate1]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1FromDate2]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1FromDate3]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1FromDate4]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1ToDate0]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1ToDate1]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1ToDate2]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1ToDate3]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J1ToDate4]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });

        //$('input[name=J2FromDate0]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2FromDate1]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2FromDate2]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2FromDate3]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2FromDate4]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2ToDate0]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2ToDate1]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2ToDate2]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2ToDate3]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        //$('input[name=J2ToDate4]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });



        $('.tab-content .save-btn').click(function () {
            civilLevy.saveLevy();
        });

        $('.tab-content .close-btn').click(function () {
            civilLevy.closeLevy();
            //Show the overall reports (that print from the levySummary page)
            $('.open-report--receipt-ledger').removeClass('d-none');
            $('.open-report--disbursement-ledger').removeClass('d-none');
            $('.open-report--sheriffFee-ledger').removeClass('d-none');
            $('.open-report--balance-ledger').removeClass('d-none');
            //Hide the reports that print for a specific levy, removing the tag for the navbar link with that levyID in the querystring
            $('.open-report--activity').addClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/activity.php');
            $('.open-report--disbursements').addClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/disbursements.php');
            $('.open-report--payoff').addClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/payoff.php');
            $('.open-report--return').addClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/return.php');
            $('.open-report--return-clerk').addClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/return.php');
            $('.open-report--worksheet').addClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/worksheet.php');
        });

        $('.new-levy').click(function () {
            $('#newLevy-modal').modal('show');//show the modal
        });

        $('.button-editLevy').click(function () {
            civilLevy.prefilter = 'OPEN';//resets the prefilter for datatables, after a user hypothetically edits their newly created levy (which would have changed the prefilter)
            var levyID = $(this).attr('data-levyID');
            civilLevy.activeID = levyID;//used to refresh the status tab via getStatus action (during editing of the levy)
            navigation.load('/civilsoftware/apps/levy/page/editLevy.php?levyID=' + levyID, { loadTimeout: 500, reinitialize: civilLevy });


            //Hide the overall reports (that print from the levySummary page)
            $('.open-report--receipt-ledger').addClass('d-none');
            $('.open-report--disbursement-ledger').addClass('d-none');
            $('.open-report--sheriffFee-ledger').addClass('d-none');
            $('.open-report--balance-ledger').addClass('d-none');
            //Show the reports that print for a specific levy, tagging the navbar link with that levyID in the querystring
            $('.open-report--activity').removeClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/activity.php?levyID=' + levyID);
            $('.open-report--disbursements').removeClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/disbursements.php?levyID=' + levyID);
            $('.open-report--payoff').removeClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/payoff.php?levyID=' + levyID);
            $('.open-report--return').removeClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/return.php?levyID=' + levyID);
            $('.open-report--return-clerk').removeClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/return.php?clerk=1&levyID=' + levyID);
            $('.open-report--worksheet').removeClass('d-none').attr('href', '/civilsoftware/apps/levy/page/report/worksheet.php?levyID=' + levyID);
        });

        var levySummaryTable = $('table.levy-summary').DataTable({
            pageLength: 25, //set default page length to 25
            order: [[7, "desc"], [8, "desc"]]//date received (hidden col), then time recieved (hidden col) //used to sort by open/closed col [7, "desc"], 
        });//when viewing all levies
        levySummaryTable.search(civilLevy.prefilter).draw();//automatically fiters by open levy status (this must execute after the edit-levy buttons have their event listeners attached (or hidden ones won't get it))



        /*Navigation within the app tabs*/
        $('.tab-container .tab').click(function () {
            //toggle the active tab when clicked
            $('.tab.active').removeClass('active');
            $(this).addClass('active');
            //toggle the active tab content
            var targetContent = $(this).attr('data-tabContent');//determine which tab-content this is attached to
            $('.tab-content.active').removeClass('active');
            $('.tab-content[data-tabContent=' + targetContent + ']').addClass('active');
        });

        // Unload warning
        $('.tab-content input, .tab-content textarea, .tab-content select').change(function(){
            //Add an alert that you have unsaved inputs (we will need to remove this listener when the submit button is pressed, to not give false alarms):
            $(window).on('beforeunload', function () { return "Leave site? Changes you made will not be saved."; });
        });

        //Update other fields based on inputs changing:
        $('.tab-content.interest .hasDependencies').change(function () {
            var judgmentIndex = $(this).attr('data-judgmentIndex');
            var inputIndex = $(this).attr('data-inputIndex');
            var principal = $('.tab-content.case input[name=JudgmentAmount' + judgmentIndex + ']').val();
            var rate = $('.tab-content.interest .hasDependencies.rate.input-' + judgmentIndex + '-' + inputIndex).val();
            if (inputIndex != 'annual') {
                var fromDate = $('.tab-content.interest .hasDependencies.fromDate.input-' + judgmentIndex + '-' + inputIndex).val();
                var toDate = $('.tab-content.interest .hasDependencies.toDate.input-' + judgmentIndex + '-' + inputIndex).val();
                var date1 = new Date(fromDate);
                var date2 = new Date(toDate);
                var days = ((date2 - date1) / 1000 / 60 / 60 / 24)+1;//calculates days difference (converts from milliseconds difference) >> add 1 per request by Mimi Williams, to include the day of judgement
            } else {
                var days = 1;//for the daily interest estimate only
            }
            var interest = days * rate / 100 / 365 * principal;
            interest = Math.round(interest * 100) / 100;//manipulates the decimal places to round to 2 decimals ($)
            //dev only//console.log('calculated: ' + interest);
            if (!isNaN(interest)) {
                $('.tab-content.interest .calculated-interest.input-' + judgmentIndex + '-' + inputIndex).val(interest);
            } else {
                $('.tab-content.interest .calculated-interest.input-' + judgmentIndex + '-' + inputIndex).val(0);//zeros it out, if it would be an error otherwise
            }
            //Now update the total interest for that specified judgment:
            var totalInterest = 0;
            for (var i = 0; i < 10; i++) {//add up those interest values
                interest = $('.tab-content.interest .calculated-interest.input-' + judgmentIndex + '-' + i).val();
                if (!isNaN(interest)) totalInterest += parseFloat(interest);//don't want to try and sum things that aren't a number
            }
            totalInterest = Math.round(totalInterest * 100) / 100;//manipulates the decimal places to round to 2 decimals ($)
            $('.tab-content.interest .calculated-interest.judgment-' + judgmentIndex + '-total').val(totalInterest);
        })
        //Receipts:
        $('.new-receipt').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            //var receiptID = $(this).attr('data-receiptID');
            $.get('/civilsoftware/apps/levy/act/getReceiptForm.php', { LevyUID: levyUID }, civilLevy.showReceiptModal);//url, data, callback
        });
        $('.edit-receipt').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            var receiptID = $(this).attr('data-receiptID');
            $.get('/civilsoftware/apps/levy/act/getReceiptForm.php', { LevyUID: levyUID, ReceiptID: receiptID }, civilLevy.showReceiptModal);//url, data, callback
        });

        //Property
        $('.add-attempt-btn').click(function () {
            var levyID = $(this).attr('data-levyID');
            $.get('/civilsoftware/apps/levy/act/getAttemptForm.php', { levyID: levyID }, civilLevy.showAttemptModal);
        });
        $('.edit-attempt-btn').click(function () {
            var levyID = $(this).attr('data-levyID');
            var attemptID = $(this).attr('data-attemptID');
            $.get('/civilsoftware/apps/levy/act/getAttemptForm.php', { levyID: levyID, attemptID: attemptID }, civilLevy.showAttemptModal);
        });
        $('.remove-attempt-btn').click(function () {
            if ($(this).hasClass('confirm')) {//this is the second time that we clicked the remove button, so the action is confirmed
                var levyID = $(this).attr('data-levyID');
                var attemptID = $(this).attr('data-attemptID');
                $.post('/civilsoftware/apps/levy/act/manageAttempts.php', { action: 'remove', LevyID: levyID, AttemptID: attemptID }, civilLevy.attemptSaved);//url, data, callback 
            } else {
                $(this).addClass('confirm');//slide the button into it's confirm mode (click again to confirm)
            }
            setTimeout(function () { $('.remove-attempt-btn.confirm').removeClass('confirm'); }, 3000);//give the user 3 seconds to click confirm, then remove the confirm class and make them start over with that double-click
        });
        $('.tab-content.property select[name=Server]').change(function () {
            // console.log('checking for custom name');
            if($(this).val() == 'custom'){ 
                // replace with a free-text input
                // console.log('found custom name');
                $(this).replaceWith("<input type='text' class='form-control' name='Server'  id='server-field' maxlength='50'>");
            }
        });

        //Expenses
        $('.new-expense').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            $.get('/civilsoftware/apps/levy/act/getExpenseForm.php', { LevyUID: levyUID }, civilLevy.showExpenseModal);//url, data, callback
        });
        $('.edit-expense').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            var expenseID = $(this).attr('data-expenseID');
            $.get('/civilsoftware/apps/levy/act/getExpenseForm.php', { LevyUID: levyUID, ExpenseID: expenseID }, civilLevy.showExpenseModal);//url, data, callback
        });

        //Disbursements
        $('.new-disbursement').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            $.get('/civilsoftware/apps/levy/act/getDisbursementForm.php', { LevyUID: levyUID }, civilLevy.showDisbursementModal);//url, data, callback
        });
        $('.edit-disbursement').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            var disbursementID = $(this).attr('data-disbursementID');
            $.get('/civilsoftware/apps/levy/act/getDisbursementForm.php', { LevyUID: levyUID, DisbursementID: disbursementID }, civilLevy.showDisbursementModal);//url, data, callback
        });

        //Status tab specifics: 
        $('.tab-content.status input[name=OpenClosed]').change(function () {
            var closed = $(this).val();//1: closed, 0: open
            if (closed == 1) {
                $('input[name=CloseDate]').prop('disabled', false);
            } else {
                $('input[name=CloseDate]').prop('disabled', true);
            }
        });
        $('.tab-content.status select[name=CurrentStatus]').change(function () {
            var newStatus = $(this).val();
            //console.log('updating status tab...');
            $.get('/civilsoftware/apps/levy/act/getStatus.php', { levyID: civilLevy.activeID, CurrentStatus: newStatus }, civilLevy.loadFreshStatus);//url, data, callback
        });

        //Return:
        $('.add-signature-btn').click(function () {
            //We need to open the eSignature-modal, with the levyID for which we are signing tagged to its hidden input
            var levyID = $(this).attr('data-levyID');
            $('#eSignature-modal input[name=levyID]').val(levyID);
            //Wipe the existing signature and checkbox:
            $('#eSignature-modal input[name=signature]').val('');
            $('#eSignature-modal #eSigConsent').prop('checked', false);
            $('#eSignature-modal').modal('show');
        });

        $('.remove-signature-btn').click(function () {
            //We need to open the eSignature-modal, with the levyID for which we are signing tagged to its hidden input
            var signatureID = $(this).attr('data-signatureID');
            var levyID = $(this).attr('data-levyID');
            //Set the values for these hidden inputs:
            $('#amend-return-modal input[name=signatureID]').val(signatureID);
            $('#amend-return-modal input[name=levyID]').val(levyID);
            //Wipe the existing reason (if applicable)
            $('#amend-return-modal textarea[name=reason]').val('');
            $('#amend-return-modal').modal('show');

            setTimeout(function () {//a timeout is needed, because the textarea is not immediately visible during the modal transition
                $('#amend-return-modal textarea[name=reason]').focus();//so that the user can go ahead and type in it
            }, 1000);

        });

        //Automatic updates:
        $('.update-source').change(function () {
            /* Whenever an update-source is changed, it will automatically update target html and/or target values. (be careful that updating values don't circular loop...)
             * data-updateHtml: attribute of the .update-source element that stores a querySelector for the other element(s) which we want to update their html accordingly
             * data-updateValue: attribute of the .update-source element that stores a querySelector for the other element(s) which we want to update their value accordingly
             */
            var newValue = $(this).val();//assumes we are only using update-source on elements that can have a value (inputs, etc.)
            var htmlUpdates = $(this).attr('data-updateHtml');//might be defined, might not (querySelector for targets)
            var valueUpdates = $(this).attr('data-updateValue');//might be defined, might not (querySelector for targets)
            var dependencies = $(this).attr('data-updateDependencies');//might be defined, might not (querySelector for targets)

            if (htmlUpdates) $(htmlUpdates).html(newValue);
            if (valueUpdates) $(valueUpdates).val(newValue);

            //Now, we might have other fields that have dependencies, which should trigger when they change and might run calculations that involved our update-source. We need to manually trigger these now:
            //Be careful to not to hit the same element(s) with update-source and the dependencies onchange trigger or you YOU WILL CAUSE AN INFINITE LOOP ON THE CLIENT!
            if (dependencies) $(dependencies).change();//manually triggers their on change event (causing their dependencies to update accordingly)

        });

    }//end: intialize method

    civilLevy.newLevyAdded = function (newLevyNumber) {
        civilLevy.prefilter = newLevyNumber;//so that they will see the new levy filtered down after the levySummary datatable refreshes
        civilLevy.closeNewLevyModal();
        //Reset new levy modal:
        $('#newLevy-modal input[type=text]').val('');
        $('#newLevy-modal input[type=number]').val(0);
        $('#newLevy-modal textarea').val('');
        navigation.load('/civilsoftware/apps/levy/page/levySummary.php', { loadTimeout: 500, reinitialize: civilLevy });
    }
    civilLevy.closeNewLevyModal = function () {
        $('#newLevy-modal').modal('hide');//show the modal
        $('#nevLevy-modal input, #nevLevy-modal textarea').val('');//reset all the inputs
        $('#nevLevy-modal input[name=JudgmentAmount1], #nevLevy-modal input[name=JudgmentAmount2]').val(0);//these get reset to zero, though
    }
    /*** Attempts management ****/
    civilLevy.showAttemptModal = function (serverRes) {
        //this content loads into the #attempt-modal .modal-body. It is a form with any pre-existing values already inserted.
        $('#attempt-modal .modal-body').html(serverRes);
        //We just need to attach the datepicker
        $('#attempt-modal .modal-body input[name=attemptDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome' });
        //And open the modal for user input, now that it is ready:
        $('#attempt-modal').modal('show');
    }
    civilLevy.attemptSaved = function (serverRes) {
        console.log(serverRes);//DEV ONLY//
        //The serverRes should be a read-only version of the attempt(s) content, to put into .attempts-section on the property tab
        try {
            //serverRes = JSON.parse(serverRes);//already a JSON object
            $('.attempt-counter').html(serverRes.count);//this app does not use an input (not saving the value), which is different than the main Civil app
            $('.attempts-section').html(serverRes.html);
            //Attach event listeners to the included buttons (edit and remove attempts)
            $('.attempts-section .edit-attempt-btn').click(function () {
                var levyID = $(this).attr('data-levyID');
                var attemptID = $(this).attr('data-attemptID');
                $.get('/civilsoftware/apps/levy/act/getAttemptForm.php', { levyID: levyID, attemptID: attemptID }, civilLevy.showAttemptModal);
            });
            $('.attempts-section .remove-attempt-btn').click(function () {
                if ($(this).hasClass('confirm')) {//this is the second time that we clicked the remove button, so the action is confirmed
                    var levyID = $(this).attr('data-levyID');
                    var attemptID = $(this).attr('data-attemptID');
                    $.post('/civilsoftware/apps/levy/act/manageAttempts.php', { action: 'remove', LevyID: levyID, AttemptID: attemptID }, civilLevy.attemptSaved);//url, data, callback 
                } else {
                    $(this).addClass('confirm');//slide the button into it's confirm mode (click again to confirm)
                }
                setTimeout(function () { $('.remove-attempt-btn.confirm').removeClass('confirm'); }, 3000);//give the user 3 seconds to click confirm, then remove the confirm class and make them start over with that double-click
            });
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }

    }


    /***** Receipts management *****/
    civilLevy.showReceiptModal = function (receiptForm) {
        $('#receipt-modal .modal-body').html(receiptForm);//loads the receiptForm html
        $('#receipt-modal input[name=Date]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });//attach the datepicker to new element
        $('#receipt-modal').modal('show');//show the modal
    }

    civilLevy.closeReceiptModal = function () {
        $('#receipt-modal').modal('hide');//show the modal
        $('#receipt-modal .modal-body').html('...');//remove the receipt form inputs
        $('#receipt-modal .delete-btn').html('DELETE').removeClass('confirm');//so that next time you load it you aren't being asked to already confirm a deletion 
    }

    civilLevy.refreshReceipts = function (levyID) {
        //DEV ONLY//console.log(levyID);
        //This is the callback after a new receipt has been added to a levy. We want to getReceipts and load it into the receipts tab, then close the receipts modal.
        $.get('/civilsoftware/apps/levy/act/getReceipts.php', { levyID: levyID }, civilLevy.loadFreshReceipts);//url, data, callback
        civilLevy.refreshStatus(civilLevy.activeID);//refreshes the status tab, since we may have just added something that needs to be reflected there
    }
    civilLevy.loadFreshReceipts = function (serverRes) {
        //DEV ONLY//console.log(serverRes);
        $('.tab-content.receipts').html(serverRes);
        //refresh some event listeners on newly generated content
        $('.tab-content.receipts .edit-receipt').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            var receiptID = $(this).attr('data-receiptID');
            $.get('/civilsoftware/apps/levy/act/getReceiptForm.php', { LevyUID: levyUID, ReceiptID: receiptID }, civilLevy.showReceiptModal);//url, data, callback
        });

        $('.tab-content.receipts .new-receipt').click(function () {//this exists on the receipts tab, so that you can edit an existing levy receipt
            var levyUID = $(this).attr('data-levyUID');
            //var receiptID = $(this).attr('data-receiptID');
            $.get('/civilsoftware/apps/levy/act/getReceiptForm.php', { LevyUID: levyUID }, civilLevy.showReceiptModal);//url, data, callback
        });

        $('.tab-content.receipts .save-btn').click(function () {
            civilLevy.saveLevy();
        });

        $('.tab-content.receipts .close-btn').click(function () {
            civilLevy.closeLevy();
        });
        civilLevy.closeReceiptModal();
        //EVENTUALLY, we will need to update the status tab to reflect the added receipt data...
    }
    /*****end: Receipts management *****/

    /***** Expenses management *****/
    civilLevy.showExpenseModal = function (expenseForm) {
        $('#expense-modal .modal-body').html(expenseForm);//loads the expenseForm html
        $('#expense-modal input[name=Date]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });//attach the datepicker to new element
        $('#expense-modal input[name=Type]').change(function () {
            var newType = $(this).val();//C: cost, F: fee, L: liquidation
            $('#expense-modal .cost, #expense-modal .fee, #expense-modal .liquidation').addClass('d-none');//hide them all, then unhide as appropriate
            switch (newType) {
                case 'C': $('#expense-modal .cost').removeClass('d-none');//show the cost options
                    console.log('Unhiding Cost');
                    break;
                case 'F': $('#expense-modal .fee').removeClass('d-none');//show the fee options
                    console.log('Unhiding Fee');
                    break;
                case 'L': $('#expense-modal .liquidation').removeClass('d-none');//show the cost options
                    console.log('Unhiding Liquidation');
                    break;
                default:
                    console.log('not sure which set of options to unhide');
                    $('#expense-modal cost, #expense-modal fee, #expense-modal liquidation').removeClass('d-none');//show them all, since something went wrong
            }
        });//end: change event for type radio buttons
        $('#expense-modal').modal('show');//show the modal
    }

    civilLevy.closeExpenseModal = function () {
        $('#expense-modal').modal('hide');//show the modal
        $('#expense-modal .modal-body').html('...');//remove the expense form inputs
        $('#expense-modal .delete-btn').html('DELETE').removeClass('confirm');//so that next time you load it you aren't being asked to already confirm a deletion 
    }

    civilLevy.refreshExpenses = function (levyID) {
        //DEV ONLY//console.log('Refresh expenses: ' + levyID);
        //This is the callback after a new expense has been added to a levy. We want to getExpenses and load it into the expenses tab, then close the expenses modal.
        $.get('/civilsoftware/apps/levy/act/getExpenses.php', { levyID: levyID }, civilLevy.loadFreshExpenses);//url, data, callback
        civilLevy.refreshStatus(civilLevy.activeID);//refreshes the status tab, since we may have just added something that needs to be reflected there
    }
    civilLevy.loadFreshExpenses = function (serverRes) {
        //DEV ONLY//console.log('Load fresh expenses: '+serverRes);
        $('.tab-content.expenses').html(serverRes);
        //refresh some event listeners on newly generated content
        $('.tab-content.expenses .edit-expense').click(function () {//this exists on the expenses tab, so that you can edit an existing levy expense
            var levyUID = $(this).attr('data-levyUID');
            var expenseID = $(this).attr('data-expenseID');
            $.get('/civilsoftware/apps/levy/act/getExpenseForm.php', { LevyUID: levyUID, ExpenseID: expenseID }, civilLevy.showExpenseModal);//url, data, callback
        });

        $('.tab-content.expenses .new-expense').click(function () {//this exists on the expenses tab, so that you can edit an existing levy expense
            var levyUID = $(this).attr('data-levyUID');
            //var expenseID = $(this).attr('data-expenseID');
            $.get('/civilsoftware/apps/levy/act/getExpenseForm.php', { LevyUID: levyUID }, civilLevy.showExpenseModal);//url, data, callback
        });

        $('.tab-content.expenses .save-btn').click(function () {
            civilLevy.saveLevy();
        });

        $('.tab-content.expenses .close-btn').click(function () {
            civilLevy.closeLevy();
        });
        civilLevy.closeExpenseModal();
        //EVENTUALLY, we will need to update the status tab to reflect the added expense data...
    }
    /*****end: Expenses management *****/

    /***** Disbursements management *****/
    civilLevy.showDisbursementModal = function (disbursementForm) {
        $('#disbursement-modal .modal-body').html(disbursementForm);//loads the disbursementForm html
        $('#disbursement-modal select.hasDependencies').change(function () {
            var selectedExpense = $('#disbursement-modal select.hasDependencies option:selected');
            //Update the prefilled fields based on selected expense:
            $('#disbursement-modal input[name=Amount]').val(selectedExpense.attr('data-amount'));
            $('#disbursement-modal input[name=Date]').val(selectedExpense.attr('data-date'));
            $('#disbursement-modal input[name=Memo]').val(selectedExpense.attr('data-memo'));
        });
        /*data-amount='{$expense['Amount']}' data-date='".$CivilLevy->dateOut($expense['Date'])."'
                                data-checkNumber='{$expense['CheckNumber']}' data-memo='{$expense['Definition']}'
                                */
        $('#disbursement-modal input[name=Date]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });//attach the datepicker to new element
        $('#disbursement-modal').modal('show');//show the modal
    }

    civilLevy.closeDisbursementModal = function () {
        $('#disbursement-modal').modal('hide');//show the modal
        $('#disbursement-modal .modal-body').html('...');//remove the disbursement form inputs
        $('#disbursement-modal .delete-btn').html('DELETE').removeClass('confirm');//so that next time you load it you aren't being asked to already confirm a deletion 
    }

    civilLevy.refreshDisbursements = function (levyID) {
        //console.log(levyID);
        //This is the callback after a new disbursement has been added to a levy. We want to getDisbursements and load it into the disbursements tab, then close the disbursements modal.
        $.get('/civilsoftware/apps/levy/act/getDisbursements.php', { levyID: levyID }, civilLevy.loadFreshDisbursements);//url, data, callback
        civilLevy.refreshStatus(civilLevy.activeID);//refreshes the status tab, since we may have just added something that needs to be reflected there
    }
    civilLevy.loadFreshDisbursements = function (serverRes) {
        //console.log(serverRes);
        $('.tab-content.disbursements').html(serverRes);
        //refresh some event listeners on newly generated content
        $('.tab-content.disbursements .edit-disbursement').click(function () {//this exists on the disbursements tab, so that you can edit an existing levy disbursement
            var levyUID = $(this).attr('data-levyUID');
            var disbursementID = $(this).attr('data-disbursementID');
            $.get('/civilsoftware/apps/levy/act/getDisbursementForm.php', { LevyUID: levyUID, DisbursementID: disbursementID }, civilLevy.showDisbursementModal);//url, data, callback
        });

        $('.tab-content.disbursements .new-disbursement').click(function () {//this exists on the disbursements tab, so that you can edit an existing levy disbursement
            var levyUID = $(this).attr('data-levyUID');
            //var disbursementID = $(this).attr('data-disbursementID');
            $.get('/civilsoftware/apps/levy/act/getDisbursementForm.php', { LevyUID: levyUID }, civilLevy.showDisbursementModal);//url, data, callback
        });

        $('.tab-content.disbursements .save-btn').click(function () {
            civilLevy.saveLevy();
        });

        $('.tab-content.disbursements .close-btn').click(function () {
            civilLevy.closeLevy();
        });
        civilLevy.closeDisbursementModal();
        //EVENTUALLY, we will need to update the status tab to reflect the added disbursement data...
    }
    /*****end: Disbursements management *****/

    civilLevy.refreshStatus = function (levyID) {
        //console.log('Refreshing status for: '+levyID);
        //This is called each time we save the Levy.
        $.get('/civilsoftware/apps/levy/act/getStatus.php', { levyID: levyID }, civilLevy.loadFreshStatus);//url, data, callback
    }
    civilLevy.loadFreshStatus = function (serverRes) {
        //console.log(serverRes);
        $('.tab-content.status').html(serverRes);
        //refresh some event listeners on newly generated content
        $('.tab-content.status .save-btn').click(function () {
            civilLevy.saveLevy();
        });

        $('.tab-content.status .close-btn').click(function () {
            civilLevy.closeLevy();
        });
        $('input[name=CloseDate]').datepicker({ uiLibrary: 'materialdesign', iconsLibrary: 'fontawesome', /*modal: true*/ });
        $('.tab-content.status input[name=OpenClosed]').change(function () {
            var closed = $(this).val();//1: closed, 0: open
            if (closed == 1) {
                $('input[name=CloseDate]').prop('disabled', false);
            } else {
                $('input[name=CloseDate]').prop('disabled', true);
            }
        });
        $('.tab-content.status select[name=CurrentStatus]').change(function () {
            var newStatus = $(this).val();
            console.log('updating status tab...');
            $.get('/civilsoftware/apps/levy/act/getStatus.php', { levyID: civilLevy.activeID, CurrentStatus: newStatus }, civilLevy.loadFreshStatus);//url, data, callback
        });
    }//end: loadFreshStatus 

    /*Return (Signatures)*/
    civilLevy.signatureAdded = function (serverRes) {//should be returning a JSON object
        var signingArea = "<div class='col ml-1 mb-3 pt-3'><i class='fas fa-pen-nib material-light-green-text mr-1'></i><span class='cursive'>" + serverRes.signature + "</span></div>";
        signingArea += "<div class='col ml-1 mb-3 pt-3 text-right text-muted'>" + serverRes.timestamp + "</div>";
        $('.tab-content.return .signing-area').html(signingArea);//we are updating the signing area according to what was just signed
        //Lock the return info, preventing further edits:
        $('#return-info').prop('disabled', true);//the textarea
        $('label[for=return-info]').html('Return Information: (locked after signing)');
        $('#eSignature-modal').modal('hide');//close the modal they just used to sign with
    }//end: signatureAdded

    civilLevy.signatureRemoved = function (serverRes) {//should be returning the levyID for reload purposes
        $('#amend-return-modal').modal('hide');//close the modal they just used to sign with  
        navigation.load('/civilsoftware/apps/levy/page/editLevy.php?levyID=' + serverRes.levyID, { loadTimeout: 500, reinitialize: civilLevy });

    }//end: signatureRemoved

    civilLevy.saveLevy = function () {
        //DEV ONLY//console.log('trying to save');
        //Check that all the tabs are valid inputs:
        var allValid = true;
        if (!caseTab.validityCheck()) {
            allValid = false;
            notification.toast('#material-toast-bottom-right', 'There is an issue to resolve on the ' + 'Case' + ' tab.', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        }
        if (!propertyTab.validityCheck()) {
            allValid = false;
            notification.toast('#material-toast-bottom-right', 'There is an issue to resolve on the ' + 'Property' + ' tab', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        }
        if (!interestTab.validityCheck()) {
            allValid = false;
            notification.toast('#material-toast-bottom-right', 'There is an issue to resolve on the ' + 'Interest' + ' tab', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        }
        if (!statusTab.validityCheck()) {
            allValid = false;
            notification.toast('#material-toast-bottom-right', 'There is an issue to resolve on the ' + 'Status' + ' tab', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
        }
        if (allValid) {
            this.tabSaved['case'] = false;
            this.tabSaved['property'] = false;
            this.tabSaved['interest'] = false;
            this.tabSaved['receipts'] = true;//doesn't need to save now or be checked here; it saves when you add/edit a specific instance
            this.tabSaved['expenses'] = true;//doesn't need to save now or be checked here; it saves when you add/edit a specific instance
            this.tabSaved['disbursements'] = true;//doesn't need to save now or be checked here; it saves when you add/edit a specific instance
            this.tabSaved['return'] = false;
            this.tabSaved['status'] = false;
            caseTab.submit();
            propertyTab.submit();
            interestTab.submit();
            returnTab.submit();
            statusTab.submit();
            $(window).off('beforeunload');//remove the alert that your changes are unsaved
        }
    }//end: saveLevy method

    civilLevy.saveNotification = function (serverRes) {
        //DEV ONLY//console.log(serverRes);
        try {
            serverRes = JSON.parse(serverRes);
        } catch (error) {
            console.log(serverRes);//so we can debug if the JSON parse fails
        }
        if (serverRes.success) {
            civilLevy.tabSaved[serverRes.tab] = true;//registers that the indicated tab has saved
            if (civilLevy.tabSaved['case'] && civilLevy.tabSaved['property'] && civilLevy.tabSaved['interest'] &&
                civilLevy.tabSaved['disbursements'] && civilLevy.tabSaved['expenses'] && civilLevy.tabSaved['return'] &&
                civilLevy.tabSaved['status'] && civilLevy.tabSaved['receipts']) {
                //only notifies if all 8 tabs have been saved:
                civilLevy.refreshStatus(civilLevy.activeID);//refreshes the status tab, after we have heard back that all the tabs saved
                notification.toast('#material-toast-bottom-right', 'Saved successfully.', '<i class="fas fa-check-circle fa-lg"></i>');//dependency on notification object
            }
        } else {
            notification.toast('#material-toast-bottom-right', 'There was a problem saving the ' + serverRes.tab + ' tab', '<i class="fas fa-exclamation-triangle fa-lg"></i>');//dependency on notification object
            console.log(serverRes);
        }
    }//end: saveNotification method

    civilLevy.closeLevy = function () {
        navigation.load('/civilsoftware/apps/levy/page/levySummary.php', { loadTimeout: 500, reinitialize: civilLevy });//go back to the list of all levies (datatable page)
        civilLevy.activeID = null;//reset
        $(window).off('beforeunload');//remove the alert that your changes are unsaved
    }

    return civilLevy;//return what we built
}
/****************************************************************************CivilLevy: Factory Function*****/