/*
    IBM BPM
 */

function ibmbpmGetProcesses() {
    var server_address = $( '#fldServerAddress').val();
    $( '#fldAvailableProcesses' ).empty();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getprocesses',
        dataType: 'json',
        success: function(data) {
            var i=0;
            for(i=0; i<data.processes.length; i++) {
                $( '#fldAvailableProcesses' ).append( '<option value="' + data.processes[i].ID + '">' + data.processes[i].name + '</option>' );
            }
            $( '#panelAvailableProcesses').css( 'display', 'block' );
        }
    });
};

function ibmbpmClearSnapshots() {
    $( '#fldAvailableSnapshots' ).empty();
    $( '#panelAvailableSnapshots').css( 'display', 'none' );
};

function ibmbpmGetSnapshots() {
    var server_address = $( '#fldServerAddress').val();
    var process_id = $('#fldAvailableProcesses').val();
    $( '#fldAvailableSnapshots' ).empty();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getsnapshots&process_id='+process_id,
        dataType: 'json',
        success: function(data) {
            var i=0;
            for(i=0; i<data.snapshots.length; i++) {
                $( '#fldAvailableSnapshots' ).append( '<option value="' + data.snapshots[i].ID + '">' + data.snapshots[i].name + '</option>' );
            }
            $( '#panelAvailableSnapshots').css( 'display', 'block' );
        }
    });
};

function ibmbpmGetVariables() {
    var server_address = $( '#fldServerAddress').val();
    var snapshot_id = $('#fldAvailableSnapshots').val();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getvariables&snapshot_id='+snapshot_id,
        dataType: 'json',
        success: function(data) {
            var i=0;
            /*for(i=0; i<data.snapshots.length; i++) {
                $( '#fldAvailableSnapshots' ).append( '<option value="' + data.snapshots[i].ID + '">' + data.snapshots[i].name + '</option>' );
            }
            $( '#panelAvailableSnapshots').css( 'display', 'block' );*/
        }
    });
};