/*
    IBM BPM
 */

var service_model_properties = null;

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
    $( '#panelVariablesTitle').css( 'display', 'none' );
    $( '#panelVariables').css( 'display', 'none' );
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

function ibmbpmGetAssets() {
    var server_address = $( '#fldServerAddress').val();
    var snapshot_id = $('#fldAvailableSnapshots').val();

    $( '#humanServicesListItems').empty();
    $( '#humanServiceDescTitle').text( 'Description' );
    $( '#humanServiceModelProperties').empty();
    $( '#humanServiceModelInputs').empty();
    $( '#humanServiceModelOutputs').empty();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getassets&snapshot_id='+snapshot_id,
        dataType: 'json',
        success: function(data) {
            var i=0;
            for(i=0; i<data.data["Human Service"].length; i++) {
                $( '#humanServicesListItems' ).append( '<div><a href="#" onclick="ibmbpmGetServiceModel(this);" class="btn btn-link" poId="' + data.data["Human Service"][i].poId + '" hsName="' + data.data["Human Service"][i].name + '">' + data.data["Human Service"][i].name + '</a></div>' );
            }
            $( '#panelVariablesTitle').css( 'display', 'block' );
            $( '#panelVariables').css( 'display', 'block' );

        }
    });
};

function ibmbpmGetServiceModel(element) {
    var server_address = $( '#fldServerAddress').val();
    var snapshot_id = $('#fldAvailableSnapshots').val();
    var po_id = $(element).attr( 'poId' );
    var hm_name = $(element).attr( 'hsName' );

    $( '#humanServiceDescTitle' ).text( 'Description for ' + hm_name );
    $( '#humanServiceModelProperties').empty();
    $( '#fldWidgetName' ).val( 'w' + hm_name.replace(/\s+/g,"") );
    $( '#widgetContentPanel').empty();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getservicemodel&po_id='+po_id+'&snapshot_id='+snapshot_id,
        dataType: 'json',
        success: function(data) {
            service_model_properties = data.data.dataModel.properties;
            ibmbpmGetPropertyTypes( data, service_model_properties, 'humanServiceModelProperties' );
            $( '.serviceModelProperty' ).draggable( { revert: "invalid", helper: "clone", appendTo: "body" } );
            $( '#widgetContentPanel').droppable(
                {   accept: ".serviceModelProperty",
                    over: function( event, ui ) {
                        $( this).css( 'border-color', '#888' );
                    },
                    out: function( event, ui ) {
                        $( this).css( 'border-color', '#ccc' );
                    },
                    drop: function( event, ui ) {
                        $( this).css( 'border-color', '#ccc' );
                        ibmbpmAddPropertyToWidgetContent( ui.draggable );
                    }
                }
            );

            /*var obj_inputs = data.data.dataModel.inputs;
            for (input_key in obj_inputs) {
                $( '#humanServiceModelInputs' ).append( '<li>' + input_key + ' <span class="label label-info">' + obj_inputs[input_key].type + '</span></li>' );
            }

            var obj_outputs = data.data.dataModel.outputs;
            for (output_key in obj_outputs) {
                $( '#humanServiceModelOutputs' ).append( '<li>' + output_key + ' <span class="label label-info">' + obj_outputs[output_key].type + '</span></li>' );
            }*/
        }
    });
};

function ibmbpmGetPropertyTypes( data, obj_types, id ) {

    for (type_property_key in obj_types) {
        var complex_type = false;
        var uid = "id" + Math.random().toString(16).slice(2);
        if (obj_types[type_property_key].type != 'String' && obj_types[type_property_key].type != 'Date' && obj_types[type_property_key].type != 'Boolean' && obj_types[type_property_key].type != 'Integer' && obj_types[type_property_key].type != 'Decimal') {
            complex_type = true;
        }
        var html_snippet = '<li>';
        if (complex_type) {
            html_snippet += '<a href="#" data-toggle="collapse" data-target="#' + uid + '">' + type_property_key + '</a> <span element-type="' + obj_types[type_property_key].type + '" element-name="' + type_property_key + '" element-complex="complex" class="label label-warning serviceModelProperty">' + obj_types[type_property_key].type + '</span><ul id="' + uid + '" class="collapse"></ul>';
        } else {
            html_snippet += type_property_key + ' <span element-type="' + obj_types[type_property_key].type + '" element-name="' + type_property_key + '" element-complex="simple" class="label label-info serviceModelProperty">' + obj_types[type_property_key].type + '</span>';
        }
        html_snippet += '</li>';
        $( '#'+id ).append( html_snippet );
        if (complex_type) {
            var child_obj_types = data.data.dataModel.validation[ obj_types[type_property_key].type ].properties;
            ibmbpmGetPropertyTypes( data, child_obj_types, uid );
        }
    }

};

function ibmbpmAddPropertyToWidgetContent( draggable ) {
    var element_name = $( draggable ).attr( 'element-name' );
    var element_type = $( draggable ).attr( 'element-type' );
    var complex_type = ( $( draggable ).attr( 'element-complex' ) == 'complex' ) ? true : false;
    if ( complex_type ) {

    } else {
        $( '#widgetContentPanel').append( element_name );
    }
};

function ibmbpmGetBusinessObject(element) {
    var server_address = $( '#fldServerAddress').val();
    var snapshot_id = $('#fldAvailableSnapshots').val();
    var po_id = $(element).attr( 'poId' );

    $( '#variableListItems').empty();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getbusinessobject&po_id='+po_id+'&snapshot_id='+snapshot_id,
        dataType: 'json',
        success: function(data) {
            var i=0;
            /*for(i=0; i<data.data.VariableType.length; i++) {
                $( '#variableListItems' ).append( '<div><a href="#" class="btn btn-link" poId="' + data.data.VariableType[i].poId + '">' + data.data.VariableType[i].name + '</a></div>' );
            }
            $( '#panelVariables').css( 'display', 'block' );*/

        }
    });
};

