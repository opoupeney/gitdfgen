/*
    IBM BPM
 */

function ibmbpmGetProcesses() {
    var server_address = $( '#fldServerAddress').val();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-1',
        dataType: 'json',
        success: function(data) {

        }
    });
}