// Axon User Mgmt - app specific constructor functions (dependecy = meta.js)
function AXONMGMT() {
    var ui = {};//we will build this

    // // event listeners // // 

    ui.initialize = function () {
        // // userLookup page:

        // load userDetails on enter key in lcsoID input
        $('input[name=lcsoID]').on('keyup', function (event) {//also submits if you hit enter
            if (event.keyCode === 13) {
                event.preventDefault();
                var lcsoID = $('input[name=lcsoID]').val();//the id they are requesting on
                // console.log(lcsoID);
                if (lcsoID) {
                    navigation.load('/axonusers/page/userDetails.php?lcso=' + lcsoID, { loadTimeout: 500, reinitialize: axonMgmt })
                }
            }
        });

        // load userDetails on click of lookup-btn
        $('.lookup-btn').click(function () {//also submits if you hit enter
            var lcsoID = $('input[name=lcsoID]').val();//the id they are requesting on
            console.log(lcsoID)
            if (lcsoID) {
                navigation.load('/axonusers/page/userDetails.php?lcso=' + lcsoID, { loadTimeout: 500, reinitialize: axonMgmt })
            }
        });

        // // userDetails page

        // return to lookup page on cancel btn
        $('.user-details .submit-btn').click(function () {
            setAxonGroup.submit(); 
            // back to lookup page
            navigation.load('/axonusers/page/userLookup.php', { loadTimeout: 500, reinitialize: axonMgmt }).setActive('userLookup');
        });

        // return to lookup page on cancel btn
        $('.user-details .cancel-btn').click(function () {
            navigation.load('/axonusers/page/userLookup.php', { loadTimeout: 500, reinitialize: axonMgmt }).setActive('userLookup');
        });

    }//end: initialize

    // // callback functions: // // 

    ui.submitNotice = function (response) {
        // $response = ['targetUser'=>null, 'groupName'=>null, 'executed'=>false, 'errorMsg'=>null];
        if (response.executed) {
            if (response.groupName == 'REMOVE') {
                notification.toast('#material-toast-bottom-right', response.targetUser + ' unassigned from Axon group.', '<i class="fas fa-lg fa-user-slash"></i>');
            } else {
                notification.toast('#material-toast-bottom-right', 'Assigning ' + response.targetUser + ' to ' + response.groupName, '<i class="fas fa-lg fa-user-check"></i>');
            }
        } else {
            console.log(response); // debugging
            notification.toast('#material-toast-bottom-right', 'Something went wrong...', '<i class="fas fa-lg fa-exclamation-triangle"></i>');
        }

    }

    return ui;//return what we built
}