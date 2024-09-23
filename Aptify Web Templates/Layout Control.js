Aptify.framework.utility.ensureNameSpaceExists("Aptify.consulting.pets.UI");

Aptify.consulting.pets.UI.layout = function () {
    Aptify.framework.inheritance.inherit(this, new Aptify.framework.formTemplates.UI.layout());
    Aptify.framework.inheritance.overrides(this, "afterLoad", _afterLoad);
	
    var oGE, ftl;
    var _that = this;
	
	var sampleToggleButton;
	var sampleWizardRunButton;	
	var sampleConfirmationButton;
	var sampleCallSDOButton;
	var sampleCallCachedDataButton;
	
	var nameDiv;
	
	function _afterLoad(options) {
        try {       
			if (options && options.formTemplateLayout) {
                ftl = options.formTemplateLayout;
                oGE = ftl.getGEObject();	
				
				if (oGE) {					
                    oGE.registerNotification({
                        event: Aptify.framework.configuration.eventDefinitions.GEFieldValueChanged,
                        callBack: _geFieldValueChanged
                    });				
										
					sampleToggleButton = ftl.findPartsByLayoutKey("Aptify.Pets__c.Tabs.General.Active Button.1");
					sampleWizardRunButton = ftl.findPartsByLayoutKey("Aptify.Pets__c.Tabs.General.Active Button.2");
					sampleConfirmationButton = ftl.findPartsByLayoutKey("Aptify.Pets__c.Tabs.General.Active Button.3");
					sampleCallSDOButton = ftl.findPartsByLayoutKey("Aptify.Pets__c.Tabs.General.Active Button.4");
					sampleCallCachedDataButton = ftl.findPartsByLayoutKey("Aptify.Pets__c.Tabs.General.Active Button.5");
					
					nameDiv = ftl.findPartsByLayoutKey("Pets__c.Name");
					
					debugger;
					
					var buttonCtrl = Aptify.framework.dataControls.UI.getControlFromElement(sampleToggleButton);
                    if (buttonCtrl) {
                        buttonCtrl.activeButtonClick = _disableEnablePetName;
                    }
    				                                        
                    if (sampleWizardRunButton) {
                        Aptify.framework.utility.UI.bindClick(sampleWizardRunButton, _sampleWizardButton);
                    }
					
					if (sampleConfirmationButton) {
                        Aptify.framework.utility.UI.bindClick(sampleConfirmationButton, _demoConfirmButton);
                    }	
					
					if (sampleCallSDOButton) {
                        Aptify.framework.utility.UI.bindClick(sampleCallSDOButton, _getPetAppointmentAndConsoleLogData);
                    }
					
					if (sampleCallCachedDataButton) {
                        Aptify.framework.utility.UI.bindClick(sampleCallCachedDataButton, _getCachedDatatAndConsoleLogData);
                    }
                }   
			}
		} catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }  
    }
	
	function _disableEnablePetName() {
		debugger;
		var input = nameDiv.find("input");
        if (input && input[0]) {
            disableInput(nameDiv, !input[0].disabled);
        }
	}
    
    function _sampleWizardButton() {
        try {
			debugger;
            localStorage.setItem("_sampleWizardData", JSON.stringify({ "Message": oGE.Name }));
            var wizardOptions = {
                wizardId: 40,
                viewId: -1,
                selectedIds: null,
                newRecordParams: ''
            };
            Aptify.framework.wizards.UI.show(wizardOptions);
        } catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }
    }  
	
	function _demoConfirmButton() {
		_sampleConfirmationWithExecutableFunction(oGE.Name);
	}
	
	function _getPetAppointmentAndConsoleLogData() {
		debugger;
		_getPetAppointmentInformation(oGE.recordId).then(function(data){
			console.log(data);
		});
	}
		            
    function _getPetAppointmentInformation(PetID) {
        return new Promise((resolve, reject) => {
            Aptify.framework.dataObjects.executeDataObject({
                name: "spGetPetAppointmentFormInformation__c",
                parameters: {
                    "PetID": PetID
                },
                successCallback: function(data) {  
                    if (data && data.results.length > 0) {
                        resolve(data.results);
                    }
                },
                errorCallback: function(error) {
                    reject(error);
                }
            });
        });
    }
	
	function _getCachedDatatAndConsoleLogData() {
		debugger;
		_getCachedMetadata().then(function(data) {
			console.log(data);
		});
	}
	
	function _geFieldValueChanged(paramData, eventData) {
        try {
            switch (eventData.field.toLowerCase()) {
				case "name":
					if (eventData.value) {
					    _showMessage("Changing Pet Name", "The name " + eventData.value + " was entered.");
					}
	    		    break;				
            }
        } catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }
    }
    
    function _disableDropDown(control) {
        try {
            var input = control.find("input");
	        if (input && input[0]) {
	            input[0].disabled = true;
	        }
	        var select = control.find('.k-select');
	        if (select && select[0]) {
	            select.remove();
	        }
        } catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }
    }
    
    function _enabledDatePickerControl(control, disableEnable) {
        try {
            if (control && control.length > 0) {
                var datepicker;
                var role = control.attr("data-role");
                if (role === "datetimepicker") {
                    datepicker = $(control[0]).data("kendoDateTimePicker");
                }
                else if (role === "datepicker") {
                    datepicker = $(control[0]).data("kendoDatePicker");
                }
                
                // If false, it will disable the date, if true, it will enable it.
                if (datepicker) {
                    datepicker.enable(!disableEnable);    
                }
            }
        } catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }
    }
	
	function _getCachedMetadata() {
        return new Promise((resolve, reject) => {
            try {
                Aptify.framework.utility.cache.getMetaData("Organizations", function (data) {
                    resolve(data);
                });
            } catch (ex) {
                Aptify.framework.exceptionManager.publish(ex);
                reject(ex.message);
            } 
        });
    }
	
	function _sampleFunctionWithParams(name) {
		_showMessage("Pet Name", "My name is " + name);
	}
	
	function _sampleConfirmationWithExecutableFunction(Name)
	{
	    _confirmSelection(e, 'Make sure you are ready for this. Are you sure you want to proceed?', "Very Important Confirmation", _sampleFunctionWithParams, Name);
	}
    
	function _confirmSelection(e, message, title, myFunction, param) {
	    try {
	        messageInfo = message;
            
            var wnd = Aptify.framework.utility.UI.messageBox.show({
                domElement: jq,
                message: messageInfo,
                width: 320,
                height: 150,
                titlePrefix: "",
                title: title,
                buttonList: [
                    { dataRole: 'a-yes', text: 'Ok' },
                    { dataRole: 'a-no', text: 'Cancel' },
                ],
                callback: _buttonClick,
                messageType: Aptify.framework.utility.UI.messageBox.MessageTypeEnum.Confirmation
            });
            
            function _buttonClick(e) {
                try {
                    switch ($(e.currentTarget).attr("data-role")) {
                        case "a-yes":
                            _btnYesNoClick(e, true);
                            break;
                    }
                } catch (e) {
                    Aptify.framework.exceptionManager.publish(e);
                }
            }
            
            function _btnYesNoClick(e, bCancel) {
                try {
                     myFunction(param);
                    
                } catch (e) {
                    Aptify.framework.exceptionManager.publish(e);
                }
            }
	    } catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }
	}
	
    function _showMessage(title, message) {
        try {
            var sHTML = "<div data-fillWidth='false' data-fillHeight='true' data-marginWidth='9' data-marginHeight='40'>" +
                            "<div data-fillWidth='true' data-fillHeight='true' class='a-setup-default-container-div'>" +
                                message
                            "</div>" +
                        "</div>";
            Aptify.framework.utility.UI.showDialog({
                modal: false,
                title: title,
                center: true,
                maximize: false,
                scrollable: true,
                contentHtml: sHTML,
                width: 250,
                height: 100                    
            });   
        } catch (ex) {
            Aptify.framework.exceptionManager.publish(ex);
        }
    }
	
	//adding to a temp array so that we can loop through later on and bind to the GE
    function addTempValues(key, value) {
        var _isInArray = false;
        for(var i = 0; i < tempValues.length; i++) {
            if (tempValues[i].key === key) {
                _isInArray = true;
            }
        }
        if (!_isInArray) {
            tempValues.push({
                "key": key,
                "value": value
            });
        } else {
            for(i = 0; i < tempValues.length; i++) {
                if (tempValues[i].key === key) {
                    tempValues[i].value = value;
                }
            }
        }
    }
    function setDynamicGEValues(){
        $(tempValues).each(function(i, obj){
            oGE.set(obj.key, obj.value);
        });
		tempValues = [];
    }
    
    function disableInput(container, disable) {
		var input = container.find("input");
        if (input && input[0]) {
            input[0].disabled = disable;
        }
    }
    
    function hideControl(container, hide) {
        if (hide) {
            container.hide();
        }
        else {
            container.show();   
        }
    }
	return this;
};