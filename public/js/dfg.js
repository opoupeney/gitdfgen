/*
    IBM BPM
 */

var service_model_types = null;

function ibmbpmToggleServerAccessPanel() {
    if ( $( '#panelServerAccessToggleIcon').hasClass( 'glyphicon-circle-arrow-down' ) ) {
        $( '#panelServerAccess' ).css( 'display', 'none' );
        $( '#panelServerAccessToggleIcon' ).removeClass( 'glyphicon-circle-arrow-down' );
        $( '#panelServerAccessToggleIcon' ).addClass( 'glyphicon-circle-arrow-up' );
        $( '#panelVariablesTitle').css( 'top', '210px' );
        $( '#panelVariables').css( 'top', '250px' );
    } else {
        $( '#panelServerAccess' ).css( 'display', 'block' );
        $( '#panelServerAccessToggleIcon').removeClass( 'glyphicon-circle-arrow-up' );
        $( '#panelServerAccessToggleIcon').addClass( 'glyphicon-circle-arrow-down' );
        $( '#panelVariablesTitle').css( 'top', '400px' );
        $( '#panelVariables').css( 'top', '440px' );
    }
}

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
}

function ibmbpmClearSnapshots() {
    $( '#fldAvailableSnapshots' ).empty();
    $( '#panelAvailableSnapshots').css( 'display', 'none' );
    $( '#panelVariablesTitle').css( 'display', 'none' );
    $( '#panelVariables').css( 'display', 'none' );
}

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
}

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
}

function ibmbpmGetServiceModel(element) {
    var server_address = $( '#fldServerAddress').val();
    var snapshot_id = $('#fldAvailableSnapshots').val();
    var po_id = $(element).attr( 'poId' );
    var hm_name = $(element).attr( 'hsName' );

    $( '#humanServiceDescTitle' ).text( 'Description for ' + hm_name );
    $( '#humanServiceModelProperties').empty();
    $( '#fldWidgetName' ).val( 'w' + hm_name.replace(/\s+/g,"") );
    $( '#widgetContentList').empty();

    $.ajax({
        url: '/data',
        data: 'q=ibmbpm-getservicemodel&po_id='+po_id+'&snapshot_id='+snapshot_id,
        dataType: 'json',
        success: function(data) {
            service_model_types = data.data.dataModel.validation;
            ibmbpmGetPropertyTypes( data, data.data.dataModel.properties, 'humanServiceModelProperties' );
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
                        ibmbpmDropPropertyToWidgetContent( ui.draggable );
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
}

function ibmbpmGetPropertyTypes( data, obj_types, id ) {

    for (type_property_key in obj_types) {
        var complex_type = false;
        var uid = "id" + Math.random().toString(16).slice(2);
        var islist = (obj_types[type_property_key].isList) ? 'true' : 'false';
        if (obj_types[type_property_key].type != 'String' && obj_types[type_property_key].type != 'Date' && obj_types[type_property_key].type != 'Boolean' && obj_types[type_property_key].type != 'Integer' && obj_types[type_property_key].type != 'Decimal') {
            complex_type = true;
        }
        var html_snippet = '<li>';
        if (complex_type) {
            html_snippet += '<a href="#" data-toggle="collapse" data-target="#' + uid + '">' + type_property_key + '</a> <span element-type="' + obj_types[type_property_key].type + '" ';
            html_snippet += 'element-name="' + type_property_key + '" element-complex="complex" element-list="' + islist + '" class="label label-warning serviceModelProperty dfg_draggable">';
            html_snippet += obj_types[type_property_key].type;
            if (obj_types[type_property_key].isList) {
                html_snippet += ' (list)';
            }
            html_snippet += '</span><ul id="' + uid + '" class="collapse"></ul>';
        } else {
            html_snippet += type_property_key + ' <span element-type="' + obj_types[type_property_key].type + '" element-name="' + type_property_key + '" element-complex="simple" class="label label-info serviceModelProperty dfg_draggable">' + obj_types[type_property_key].type + '</span>';
        }
        html_snippet += '</li>';
        $( '#'+id ).append( html_snippet );
        if (complex_type) {
            var child_obj_types = data.data.dataModel.validation[ obj_types[type_property_key].type ].properties;
            ibmbpmGetPropertyTypes( data, child_obj_types, uid );
        }
    }

}

function ibmbpmDropPropertyToWidgetContent( draggable ) {
    var element_name = $( draggable ).attr( 'element-name' );
    var element_type = $( draggable ).attr( 'element-type' );
    var element_list = $( draggable ).attr( 'element-list' );
    var complex_type = ( $( draggable ).attr( 'element-complex' ) == 'complex' ) ? true : false;
    ibmbpmAddPropertyToWidgetContent( element_name, element_type, element_list, complex_type, 'false', 'widgetContentList' );
    $( 'ul[element-data-type=sortable]').sortable();
}

function ibmbpmAddPropertyToWidgetContent( element_name, element_type, element_list, complex_type, parent_list, id ) {

    var html_snippet = '<li element-name="' + element_name + '" element-type=';

    if ( complex_type ) {
        var child_obj = service_model_types[element_type];
        var uid = "id" + Math.random().toString(16).slice(2);
        if (element_list == 'true') {
            html_snippet +=  '"Grid"><span>' + element_name + ' -> Grid</span><ul element-data-type="sortable" id="' + uid + '"></ul></li>';
        } else {
            html_snippet +=  '"GridPanel"><span>' + element_name + ' -> GridPanel</span><ul element-data-type="sortable" id="' + uid + '"></ul></li>';
        }
        $( '#'+id ).append( html_snippet );
        for (child_property in child_obj.properties) {
            var child_property_type = child_obj.properties[child_property].type;
            var child_property_list = (child_obj.properties[child_property].isList) ? 'true' : 'false';
            var child_property_complex = (child_property_type == 'String' || child_property_type == 'Date' || child_property_type == 'Boolean' || child_property_type == 'Integer' || child_property_type == 'Decimal') ? false : true;
            ibmbpmAddPropertyToWidgetContent( child_property, child_property_type, child_property_list, child_property_complex, element_list, uid );
        }
    } else {
        var element_control = '';
        if (parent_list=='true') {
            element_control = 'Column';
        } else {
            if (element_type == 'Date') {
                element_control = 'DateField';
            } else if (element_type == 'Integer') {
                element_control = 'NumericField';
            } else {
                element_control = 'TextField';
            }
        }
        html_snippet +=  '"' + element_control + '">' + element_name + ' -> ' + element_control;
        html_snippet += '</span></li>';
        $( '#'+id ).append( html_snippet );
    }
}

function ibmbpmGenerateToDFCloudApp() {
    var widget_name = $( '#fldWidgetName' ).val();
    var widget_category = $( '#fldWidgetCategory' ).val();
    var widget_description = $( '#fldWidgetDescription' ).val();
    var today = new Date();

    var widget_json = {
        "name" : widget_name,
        "description" : widget_description,
        "category" : widget_category,
        "subscriptions" : [],
        "ownerId": "john",
        "events" : [],
        "dataquery" : "",
        "type" : "WidgetBuilder",
        "loadOnDisplay" : "yes",
        "publicwgt" : "yes",
        "personalization" : [],
        "requestDate" : "2014-01-09T15:10:10.221Z",
        "parameters" : {
            "widgetDefinition" : {
                "definition": [
                    {
                        "id": "workspace",
                        "perspectives": {},
                        "styles": {
                            "height": "auto",
                            "CSS-Class": "",
                            "stylesheet": ""
                        },
                        "attributes": {},
                        "type": "widget"
                    }
                ],
                "subscriptions" : [],
                "events": [],
                "actions": [],
                "wgtlayout": "relative",
                "attributes": {
                    "loadOnDisplay" : "",
                    "binding" : "",
                    "qparams" : null
                }
            }
        },
        "actions": [],
        "wgtlayout": "relative",
        "visibility" : "visible",
        "lock" : { "status" : "unlocked" }
    }

    var child_elements = new Array();
    ibmbpmGenerateToDFCloudAppAddElements( 'widgetContentList', 'workspace', child_elements );
    widget_json.parameters.widgetDefinition.definition[0].children = child_elements;
    $.ajax({
        url: '/generate',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(widget_json),
        success: function(data) {
            alert( 'generation completed' );
        }
    });
}

function ibmbpmGenerateToDFCloudAppAddElements( parent_list, parent_id, child_elements, placeholder_suffix ) {
    $( 'ul#' + parent_list + ' > li' ).each( function(i) {
        var element_id = "id" + Math.random().toString(16).slice(2);
        var element_name = $( this).attr( 'element-name' );
        var element_type = $( this).attr( 'element-type' );
        var child_element = {
            "id": element_id,
            "type": element_type,
            "repository": "api",
            "name": element_type,
            "events": [],
            "children": [],
            "parentid": parent_id,
            "styles": [],
            "attributes": []
        }
        if (element_type == 'TextField') {
            child_element.attributes = [
                { "name": "name", "settings": { "value": element_name } },
                { "name": "label", "settings": { "value": element_name } },
                { "name": "labelAlign", "settings": { "value": "left" } }
            ];
            if (placeholder_suffix != null) {
                child_element.attributes.push( { "name": "placeholder_suffix", "settings": { "value": placeholder_suffix } } );
            }
            child_element.styles = [
                { "name": "width", "settings": { "value": "200px" } },
                { "name": "height", "settings": { "value": "auto" } },
                { "name": "labelWidth", "settings": { "value": "100px" } },
                { "name": "position", "settings": { "value": "relative" } }
            ];
        } else if (element_type == 'DateField') {
            child_element.attributes = [
                { "name": "name", "settings": { "value": element_name } },
                { "name": "label", "settings": { "value": element_name } },
                { "name": "labelAlign", "settings": { "value": "left" } },
                { "name": "disabledDates",  "settings" : {
                    "value" : "",
                    "protect" : false,
                    "picker" : {
                        "values" : [],
                        "mode" : "static"
                    }}, "type" : {
                        "multitype" : "disabledDates",
                        "name" : "datapicker",
                        "mode" : "multiple"
                    }}
            ];
            if (placeholder_suffix != null) {
                child_element.attributes.push( { "name": "placeholder_suffix", "settings": { "value": placeholder_suffix } } );
            }
            child_element.styles = [
                { "name": "width", "settings": { "value": "200px" } },
                { "name": "height", "settings": { "value": "auto" } },
                { "name": "labelWidth", "settings": { "value": "100px" } },
                { "name": "position", "settings": { "value": "relative" } }
            ];
        } else if (element_type == 'GridPanel') {
            var gridpanel_item_id = Math.random().toString(16).slice(2);
            child_element.name = 'GridPanel';
            child_element.type = 'GridPanel';
            child_element.attributes = [
                { "name": "name", "settings": { "value": element_name } },
                { "name": "title", "settings": { "value": element_name } },
                { "name": "spacing", "settings": { "value": "5px" } },
                { "name": "nbcols", "settings": { "value": "1" } },
                { "name": "cols", "settings": { "value": [
                        {
                            "id": gridpanel_item_id,
                            "alignment":"",
                            "colspan": "0",
                            "height": "auto",
                            "disposal": "vertically",
                            "name": "left-col",
                            "width": "100",
                            "rowspan": "0"
                        }
                    ]}
                }
            ];
            if (placeholder_suffix != null) {
                child_element.attributes.push( { "name": "placeholder_suffix", "settings": { "value": placeholder_suffix } } );
            }
            child_element.styles = [
                { "name": "width", "settings": { "value": "500px" } },
                { "name": "height", "settings": { "value": "auto" } },
                { "name": "position", "settings": { "value": "relative" } }
            ];
            var panel_list = $('ul:first', this).attr( 'id' );
            ibmbpmGenerateToDFCloudAppAddElements( panel_list, element_id, child_element.children, '_pnl_body_'+gridpanel_item_id );
        }
        child_elements.push( child_element );
    });
}

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
}

