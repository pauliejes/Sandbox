jQuery.fn.extend(
{
	insertAtCaret: function (textToInsert)
	{
		return this.each(function (i)
		{
			if (document.selection)
			{
				this.focus();
				sel = document.selection.createRange();
				sel.text = textToInsert;
				this.focus();
			}
			else if (this.selectionStart || this.selectionStart == '0')
			{
				var startPos = this.selectionStart;
				var endPos = this.selectionEnd;
				var scrollTop = this.scrollTop;
				this.value = this.value.substring(0, startPos) + textToInsert + this.value.substring(endPos, this.value.length);
				this.focus();
				this.selectionStart = startPos + textToInsert.length;
				this.selectionEnd = startPos + textToInsert.length;
				this.scrollTop = scrollTop;
			}
			else
			{
				this.value += textToInsert;
				this.focus();
			}
		})
	}
});
define(function ()
{
	var ScriptEditor = {};
	var isInitialized = false;
	return {
		getSingleton: function ()
		{
			if (!isInitialized)
			{
				initialize.call(ScriptEditor);
				isInitialized = true;
			}
			return ScriptEditor;
		}
	}

	function initialize()
	{
		this.resize = function ()
		{
			$('#ScriptEditorTabs').css('height', $('#ScriptEditor').height() + 'px');
			var w = ($('#textinnere').parent().width() - 190);
			if (w <= 0) w = ($('#textinnerm').parent().width() - 190);
			if (w <= 0) w = ($('#textinnerp').parent().width() - 190);
			var h = ($('#textinnere').parent().height() - 125);
			if (h <= 50) h = ($('#textinnerm').parent().height() - 125);
			if (h <= 50) h = ($('#textinnerp').parent().height() - 125);
			$('#textinnerm').css('width', w + 'px')
			$('#textinnere').css('width', w + 'px')
			$('#textinnerp').css('width', w + 'px')
			$('#textinnerm').css('height', h + 'px')
			$('#textinnere').css('height', h + 'px')
			$('#textinnerp').css('height', h + 'px')
			
			
			$('#methodlist').css('height', h + 'px');
			$('#eventlist').css('height', h + 'px');
			$('#propertylist').css('height', h + 'px');
			
			
			h += 15;
			$('#checkSyntaxMethod').css('top', h + 'px');
			$('#checkSyntaxEvent').css('top', h + 'px');
			$('#callMethod').css('top', h + 'px');
			$('#deleteMethod').css('top', h + 'px');
			$('#newMethod').css('top', h + 'px');
			$('#newProperty').css('top', h + 'px');
			$('#saveMethodCopy').css('top', h + 'px');
			$('#callEvent').css('top', h + 'px');
			$('#deleteEvent').css('top', h + 'px');
			$('#deleteProperty').css('top', h + 'px');
			$('#newEvent').css('top', h + 'px');
			$('#saveEventCopy').css('top', h + 'px');
			_ScriptEditor.methodEditor.resize();
			_ScriptEditor.eventEditor.resize();
			_ScriptEditor.propertyEditor.resize();
			$('#saveMethod').css('top', $('#ScriptEditor').height() - 75);
			$('#saveEvent').css('top', $('#ScriptEditor').height() - 75);
			$('#saveProperty').css('top', $('#ScriptEditor').height() - 75);
		}
		$(document.body).append('<script src="../vwf/view/editorview/ace/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>');
		$(document.body).append("<div id='ScriptEditorAbandonChanges'>You have are about to load a different script,but you have unsaved changes to this script. Do you want to continue and abandon the changes? This action cannot be undone.</div>");
		$(document.body).append("<div id='ScriptEditorCreateMethod'><input id='newMethodName' type='text' /></div>");
		$(document.body).append("<div id='ScriptEditorCreateEvent'><input id='newEventName' type='text' /></div>");
		$(document.body).append("<div id='ScriptEditorCreateProperty'><input id='newPropertyName' type='text' /></div>");
		$(document.body).append("<div id='ScriptEditorDeleteMethod'>Are you sure you want to delete this script? This cannot be undone.</div>");
		$(document.body).append("<div id='ScriptEditorDeleteProperty'>Are you sure you want to delete this property? This cannot be undone.</div>");
		$(document.body).append("<div id='ScriptEditorDeleteEvent'>Are you sure you want to delete this script? This cannot be undone.</div>");
		$(document.body).append("<div id='ScriptEditorMessage'>This script contains syntax errors, and cannot be saved;</div>");
		$(document.body).append("<div id='ScriptEditor'  style=''>" +
		"<div id='scripteditortitle' style = 'padding:3px 4px 3px 4px;font:1.5em sans-serif;font-weight: bold;' class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix' >"+
		"<span class='ui-dialog-title' id='ui-dialog-title-Players'>ScriptEditor</span></div>" +
		 '<div id="ScriptEditorTabs" style="width:100%;height:100%;overflow:hidden;padding: 0px 10px 0px 0px;">' +
		 '	<ul>' +
		 '		<li><a href="#methods">Methods</a></li>'+ 
		 '		<li><a href="#events">Events</a></li>' +
		 '		<li><a href="#properties">Properties</a></li>' +
		 '	</ul>'+
		 '	<div id="methods" style="height: 100%;padding:4px">' +
		 '		<div style="width: 180px;display: inline-block;vertical-align: top;">'+
		 '      <div id="methodlist"/><div id="saveMethod"/></div>' +
		 '      <div id="textinnerm" style="display: inline-block;position:absolute">' +
		'          <div style="position: absolute;top: 0px;width: 100%;height: 100%;border: 1px black solid;"  id="methodtext" />' +
		 '         <div id="callMethod"/><div id="deleteMethod"/><div id="newMethod"/><div id="checkSyntaxMethod"/><div id="saveMethodCopy"/>'+
		 '      </div>' + 
		 '	</div>' + 
		 '	<div id="events" style="height: 100%;padding:4px">'+
		 '		<div style="width: 180px;display: inline-block;vertical-align: top;">'+
		'       <div id="eventlist"/><div id="saveEvent"/></div>' + 
		'		<div id="textinnere" style="display: inline-block;position:absolute">' +
		'          <div style="position: absolute;top: 0px;width: 100%;height: 100%;border: 1px black solid;"  id="eventtext" />'		+
		'		   <div id="callEvent"/><div id="deleteEvent"/><div id="newEvent"/><div id="checkSyntaxEvent"/><div id="saveEventCopy"/>' +
		'		</div>' +
		'	</div>' +
		 '	<div id="properties" style="height: 100%;padding:4px">'+
		 '		<div style="width: 180px;display: inline-block;vertical-align: top;">'+
		'       <div id="propertylist"/><div id="saveProperty"/></div>' + 
		'		<div id="textinnerp" style="display: inline-block;position:absolute">' +
		'          <div style="position: absolute;top: 0px;width: 100%;height: 100%;border: 1px black solid;"  id="propertytext" />'		+
		'		   <div id="deleteProperty"/><div id="newProperty"/>' +
		'		</div>' +
		'	</div>' +
		'</div>' +
		"</div>");
		this.MethodChanged = false;
		this.EventChanged = false;
		//$('#ScriptEditor').resize(function(){_ScriptEditor.resize()});
		$('#scripteditortitle').prepend('<img class="headericon" src="../vwf/view/editorview/images/icons/script.png" />');
		$('#scripteditortitle').append('<img id="maximizescripteditor" style="float:right" class="icon" src="../vwf/view/editorview/images/icons/up2.png" />');
		$('#scripteditortitle').append('<img id="hidescripteditor" class="icon" style="float:right" src="../vwf/view/editorview/images/icons/down.png" />');
		$('#hidescripteditor').click(function ()
		{
			_ScriptEditor.hide();
		});
		$('#maximizescripteditor').click(function ()
		{
			if (!$('#ScriptEditor').attr('maximized'))
			{
				$('#ScriptEditor').attr('originalheight', $('#ScriptEditor').height());
				$('#ScriptEditor').attr('originaltop', $('#ScriptEditor').offset().top);
				$('#ScriptEditor').css('top', $('#toolbar').offset().top + $('#toolbar').height() + 'px');
				$('#ScriptEditor').attr('maximized', true);
				$('#ScriptEditor').css('height', $(window).height() - $('#toolbar').height() - $('#smoothmenu1').height() - $('#statusbar').height() + 'px');
				$('#maximizescripteditor').attr('src', 'vwf/view/editorview/images/icons/window.png');
			}
			else
			{
				$('#ScriptEditor').css('top', $('#ScriptEditor').attr('originaltop') + 'px');
				$('#ScriptEditor').css('height', $(window).height() - $('#ScriptEditor').offset().top - $('#statusbar').height() + 'px');
				$('#ScriptEditor').removeAttr('maximized');
				$('#maximizescripteditor').attr('src', 'vwf/view/editorview/images/icons/up2.png');
				var scripteditorheight = $('#ScriptEditor').offset().top;
				if (scripteditorheight != 0) scripteditorheight = $(window).height() - scripteditorheight;
				$('#index-vwf').css('height', window.innerHeight - $('#smoothmenu1').height() - $('#statusbar').height() - $('#toolbar').height() - (scripteditorheight - 25) + 'px');
				_Editor.findcamera().aspect = ($('#index-vwf').width() / $('#index-vwf').height());
				_Editor.findcamera().updateProjectionMatrix();
			}
			_ScriptEditor.resize();
		});
		//$('#ScriptEditor').dialog({title:'Script Editor',autoOpen:false,resize:this.resize,height:520,width:760,position:'center'});
		$('#ScriptEditorDeleteMethod').dialog(
		{
			title: 'Delete Method?',
			autoOpen: false,
			height: 'auto',
			width: '200px',
			position: 'center',
			modal: true,
			buttons: {
				'Yes': function ()
				{
					_ScriptEditor.DeleteActiveMethod_imp();
					$('#ScriptEditorDeleteMethod').dialog('close');
				},
				'No': function ()
				{
					$('#ScriptEditorDeleteMethod').dialog('close');
				},
			}
		});
		$('#ScriptEditorDeleteProperty').dialog(
		{
			title: 'Delete Property?',
			autoOpen: false,
			height: 'auto',
			width: '200px',
			position: 'center',
			modal: true,
			buttons: {
				'Yes': function ()
				{
					_ScriptEditor.DeleteActiveProperty_imp();
					$('#ScriptEditorDeleteProperty').dialog('close');
				},
				'No': function ()
				{
					$('#ScriptEditorDeleteProperty').dialog('close');
				},
			}
		});
		$('#ScriptEditorDeleteEvent').dialog(
		{
			title: 'Delete Event?',
			autoOpen: false,
			height: 'auto',
			width: '200px',
			position: 'center',
			modal: true,
			buttons: {
				'Yes': function ()
				{
					_ScriptEditor.DeleteActiveEvent_imp();
					$('#ScriptEditorDeleteEvent').dialog('close');
				},
				'No': function ()
				{
					$('#ScriptEditorDeleteEvent').dialog('close');
				},
			}
		});
		$('#ScriptEditorAbandonChanges').dialog(
		{
			title: 'Abandon Changes?',
			autoOpen: false,
			height: 'auto',
			width: '200px',
			position: 'center',
			modal: true,
			buttons: {
				'Yes': function ()
				{
					_ScriptEditor.AbandonChangesCallback();
					$('#ScriptEditorAbandonChanges').dialog('close');
				},
				'No': function ()
				{
					$('#ScriptEditorAbandonChanges').dialog('close');
				},
			}
		});
		$('#ScriptEditorMessage').dialog(
		{
			title: 'Syntax Error',
			autoOpen: false,
			height: 'auto',
			width: '200px',
			position: 'center',
			modal: true,
			buttons: {
				'Ok': function ()
				{
					$('#ScriptEditorMessage').dialog('close');
				},
			}
		});
		$('#ScriptEditorCreateMethod').dialog(
		{
			title: 'Enter Method Name',
			autoOpen: false,
			height: 'auto',
			width: '300px',
			position: 'center',
			modal: true,
			buttons: {
				'Ok': function ()
				{
					var name = $('#newMethodName').val();
					_ScriptEditor.setSelectedMethod(name, 'function ' + name + '(){\n\n console.log("got here"); \n\n}');
					$('#ScriptEditorCreateMethod').dialog('close');
				},
				'Cancel': function ()
				{
					$('#ScriptEditorCreateMethod').dialog('close');
				}
			}
		});
		$('#ScriptEditorCreateProperty').dialog(
		{
			title: 'Enter Method Name',
			autoOpen: false,
			height: 'auto',
			width: '300px',
			position: 'center',
			modal: true,
			buttons: {
				'Ok': function ()
				{
					var name = $('#newPropertyName').val();
					_ScriptEditor.setSelectedProperty(name, '"null"');
					_ScriptEditor.SavePropertyClicked(true);
					$('#ScriptEditorCreateProperty').dialog('close');
				},
				'Cancel': function ()
				{
					$('#ScriptEditorCreateProperty').dialog('close');
				}
			}
		});
		$('#ScriptEditorCreateEvent').dialog(
		{
			title: 'Enter Event Signiture',
			autoOpen: false,
			height: 'auto',
			width: '300px',
			position: 'center',
			modal: true,
			buttons: {
				'Ok': function ()
				{
					var name = $('#newEventName').val();
					name = name.substring(0, name.indexOf('('));
					name = $.trim(name);
					_ScriptEditor.setSelectedEvent(name, 'function ' + $('#newEventName').val() + '{\n\n console.log("got here"); \n\n}');
					$('#ScriptEditorCreateEvent').dialog('close');
				},
				'Cancel': function ()
				{
					$('#ScriptEditorCreateEvent').dialog('close');
				}
			}
		});
		$('#ScriptEditorTabs').tabs();
		$('#ScriptEditorTabs ul').css('background', 'lightgray');
		$('#methodlist').css('width', '180px');
		$('#eventlist').css('width', '180px');
		$('#propertylist').css('width', '180px');
		
		
		$('#methodlist').css('overflow-y', 'scroll');
		$('#eventlist').css('overflow-y', 'scroll');
		$('#propertylist').css('overflow-y', 'scroll');
		
		
		$('#saveEvent').css('position', 'absolute');
		$('#saveProperty').css('position', 'absolute');
		//$('#saveEvent').css('bottom','6px');
		$('#saveEvent').css('width', '175px');
		$('#saveProperty').css('width', '175px');
		//$('#saveEventCopy').css('position','absolute');
		$('#saveEventCopy').css('bottom', '10px');
		$('#saveEventCopy').css('width', '145px');
		//$('#saveMethodCopy').css('position','absolute');
		$('#saveMethodCopy').css('bottom', '10px');
		$('#saveMethodCopy').css('width', '145px');
		$('#saveMethod').css('position', 'absolute');
		//$('#saveMethod').css('bottom','6px');
		$('#saveMethod').css('width', '175px');
		$('#saveEventCopy').button(
		{
			label: 'Save in Inventory'
		});
		$('#saveMethodCopy').button(
		{
			label: 'Save in Inventory'
		});
		$('#saveEvent').button(
		{
			label: 'Save Event'
		});
		$('#saveProperty').button(
		{
			label: 'Save Property'
		});
		$('#saveMethod').button(
		{
			label: 'Save Method'
		});
		$('#callMethod').button(
		{
			label: 'Call Method'
		});
		$('#deleteMethod').button(
		{
			label: 'Delete Method'
		});
		$('#deleteProperty').button(
		{
			label: 'Delete Property'
		});
		$('#newMethod').button(
		{
			label: 'New Method'
		});
		$('#newProperty').button(
		{
			label: 'New Property'
		});
		$('#checkSyntaxEvent').button(
		{
			label: 'Check Code'
		});
		$('#checkSyntaxMethod').button(
		{
			label: 'Check Code'
		});
		$('#checkSyntaxMethod').css('float', 'right');
		$('#checkSyntaxEvent').css('float', 'right');
		$('#checkSyntaxMethod').css('margin-top', '3px');
		$('#checkSyntaxEvent').css('margin-top', '3px');
		$('#saveEventCopy').css('float', 'right');
		$('#saveMethodCopy').css('float', 'right');
		$('#saveMethodCopy').css('margin-top', '3px');
		$('#saveEventCopy').css('margin-top', '3px');
		$('#callMethod').css('float', 'right');
		$('#deleteMethod').css('float', 'right');
		$('#newMethod').css('float', 'right');
		$('#newProperty').css('float', 'right');
		$('#callMethod').css('margin-top', '3px');
		$('#deleteMethod').css('margin-top', '3px');
		$('#deleteProperty').css('margin-top', '3px');
		$('#newMethod').css('margin-top', '3px');
		$('#callEvent').button(
		{
			label: 'Trigger Event'
		});
		$('#deleteEvent').button(
		{
			label: 'Delete Event'
		});
		$('#newEvent').button(
		{
			label: 'New Event'
		});
		$('#callEvent').css('float', 'right');
		$('#deleteEvent').css('float', 'right');
		$('#newEvent').css('float', 'right');
		$('#callEvent').css('margin-top', '3px');
		$('#deleteEvent').css('margin-top', '3px');
		$('#deleteProperty').css('margin-top', '3px');
		$('#newEvent').css('margin-top', '3px');
		
		$('#saveMethodCopy').click(function (e)
		{
			if (!_ScriptEditor.checkMethodSyntax())
			{
				return
			}
			_InventoryManager.addScript(_ScriptEditor.methodEditor.getValue(), _ScriptEditor.selectedMethod, 'method');
		});
		$('#saveEventCopy').click(function (e)
		{
			if (!_ScriptEditor.checkEventSyntax())
			{
				return
			}
			_InventoryManager.addScript(_ScriptEditor.eventEditor.getValue(), _ScriptEditor.selectedEvent, 'event');
		});
		this.DeleteActiveMethod_imp = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (this.currentNode.methods && this.currentNode.methods[this.selectedMethod])
			{
				vwf_view.kernel.deleteMethod(_ScriptEditor.currentNode.id, this.selectedMethod);
				window.setTimeout(function ()
				{
					_ScriptEditor.currentNode = vwf.getNode(_ScriptEditor.currentNode.id);
					_ScriptEditor.BuildGUI();
				}, 500);
			}
		}
		this.DeleteActiveProperty_imp = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (this.currentNode.properties && this.currentNode.properties[this.selectedProperty])
			{
				vwf_view.kernel.deleteProperty(_ScriptEditor.currentNode.id, this.selectedProperty);
				window.setTimeout(function ()
				{
					_ScriptEditor.currentNode = vwf.getNode(_ScriptEditor.currentNode.id);
					_ScriptEditor.BuildGUI();
				}, 500);
			}
		}
		this.DeleteActiveMethod = function ()
		{
			$('#ScriptEditorDeleteMethod').dialog('open');
		}
		this.DeleteActiveProperty = function ()
		{
			$('#ScriptEditorDeleteProperty').dialog('open');
		}
		this.CallActiveMethod = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			vwf_view.kernel.callMethod(_ScriptEditor.currentNode.id, _ScriptEditor.selectedMethod);
		}
		this.checkMethodSyntaxClick = function ()
		{
			if (_ScriptEditor.checkMethodSyntax())
			{
				alertify.alert('This script contains no syntax errors.');
				
			}
		}
		this.checkMethodSyntax = function ()
		{
			var s = _ScriptEditor.methodEditor.getSession().getAnnotations();
			var errors = "";
			for (var i = 0; i < s.length; i++)
			{
				if (s[i].type == 'error') errors += "<br/> line: " + s[i].row + "-" + s[i].text;
			}
			if (errors != "")
			{
				alertify.alert('This script contains syntax errors, and cannot be saved. The errors are: \n' + errors.toString());
				
				return false;
			}
			return true;
		}
		this.DeleteActiveEvent_imp = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (this.currentNode.events && this.currentNode.events[this.selectedEvent])
			{
				vwf_view.kernel.deleteEvent(_ScriptEditor.currentNode.id, this.selectedEvent);
				window.setTimeout(function ()
				{
					_ScriptEditor.currentNode = vwf.getNode(_ScriptEditor.currentNode.id);
					_ScriptEditor.BuildGUI();
				}, 500);
			}
		}
		this.checkPermission = function ()
		{
			if (!_UserManager.GetCurrentUserName())
			{
				_Notifier.notify('You must log in to edit scripts');
				return false;
			}
			
			if (_PermissionsManager.getPermission(_UserManager.GetCurrentUserName(),_ScriptEditor.currentNode.id) == 0)
			{
				_Notifier.notify('You do not have permission to script this object');
				return false;
			}
			return true;
		}
		this.DeleteActiveEvent = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			$('#ScriptEditorDeleteEvent').dialog('open');
		}
		this.CallActiveEvent = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			vwf_view.kernel.fireEvent(_ScriptEditor.currentNode.id, _ScriptEditor.selectedEvent);
		}
		this.checkEventSyntaxClick = function ()
		{
			if (_ScriptEditor.checkEventSyntax())
			{
				$('#ScriptEditorMessage').text('This script contains no syntax errors.');
				$('#ScriptEditorMessage').dialog('open');
			}
		}
		this.checkEventSyntax = function ()
		{
			var s = _ScriptEditor.eventEditor.getSession().getAnnotations();
			var errors = "";
			for (var i = 0; i < s.length; i++)
			{
				if (s[i].type == 'error') errors += "<br/> line: " + s[i].row + "-" + s[i].text;
			}
			if (errors != "")
			{
				$('#ScriptEditorMessage').text('This script contains syntax errors, and cannot be saved. The errors are: \n' + errors.toString());
				$('#ScriptEditorMessage').dialog('open');
				return false;
			}
			return true;
		}
		this.NewMethod = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (_ScriptEditor.MethodChanged) _ScriptEditor.PromptAbandon(function ()
				{
					_ScriptEditor.MethodChanged = false;
					$('#ScriptEditorCreateMethod').dialog('open');
				});
			else $('#ScriptEditorCreateMethod').dialog('open');
		}
		this.NewEvent = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (_ScriptEditor.EventChanged) _ScriptEditor.PromptAbandon(function ()
				{
					_ScriptEditor.EventChanged = false;
					$('#ScriptEditorCreateEvent').dialog('open');
				});
			else $('#ScriptEditorCreateEvent').dialog('open');
		}
		this.NewProperty = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (_ScriptEditor.PropertyChanged) _ScriptEditor.PromptAbandon(function ()
				{
					_ScriptEditor.PropertyChanged = false;
					$('#ScriptEditorCreateProperty').dialog('open');
				});
			else $('#ScriptEditorCreateProperty').dialog('open');
		}
		this.MethodChange = function ()
		{
			if (!_ScriptEditor.selectedMethod) return false;
			_ScriptEditor.MethodChanged = true;
			$('#methodtext').css('border-color', 'red');
			return true;
		}
		this.EventChange = function ()
		{
			if (!_ScriptEditor.selectedEvent) return false;
			_ScriptEditor.EventChanged = true;
			$('#eventtext').css('border-color', 'red');
			return true;
		}
		this.PropertyChange = function ()
		{
			if (!_ScriptEditor.selectedProperty) return false;
			_ScriptEditor.PropertyChanged = true;
			$('#propertytext').css('border-color', 'red');
			return true;
		}
		$('#deleteMethod').click(this.DeleteActiveMethod);
		$('#deleteProperty').click(this.DeleteActiveProperty);
		$('#callMethod').click(this.CallActiveMethod);
		$('#checkSyntaxMethod').click(this.checkMethodSyntaxClick);
		$('#deleteEvent').click(this.DeleteActiveEvent);
		$('#callEvent').click(this.CallActiveEvent);
		$('#checkSyntaxEvent').click(this.checkEventSyntaxClick);
		$('#newMethod').click(this.NewMethod);
		$('#newEvent').click(this.NewEvent);
		$('#newProperty').click(this.NewProperty);

		this.show = function ()
		{
			//window.clearInterval(window.scripthideinterval);
			if (!this.isOpen())
			{
				//window.scripthideinterval = window.setInterval(function(){
				//		$('#ScriptEditorTabs').css('height',$('#ScriptEditor').height() + 'px');
				//		$('#index-vwf').css('height',window.innerHeight - $('#smoothmenu1').height() - $('#statusbar').height() - //$('#toolbar').height() - ($(window).height() - $('#ScriptEditor').offset().top-25) + 'px');
				//		_Editor.findscene().camera.setAspect($('#index-vwf').width()/$('#index-vwf').height());
				//		
				//	},33);
				//$('#ScriptEditor').show('slide',{direction:'down'},function(){window.clearInterval(window.scripthideinterval);window.scripthideinterval=null;});
				$('#ScriptEditor').show();
				var newtop = $(window).height() - $('#ScriptEditor').height() - $('#statusbar').height() + 'px';
				console.log(newtop);
				$('#ScriptEditor').animate(
				{
					'top': newtop
				},
				{
					step: function ()
					{
						$('#ScriptEditorTabs').css('height', $('#ScriptEditor').height() + 'px');
						var newheight = window.innerHeight - $('#smoothmenu1').height() - $('#statusbar').height() - $('#toolbar').height() - ($(window).height() - $('#ScriptEditor').offset().top - 25) + 'px';
						console.log(newheight);
						$('#index-vwf').css('height', newheight);
						_Editor.findcamera().aspect = ($('#index-vwf').width() / $('#index-vwf').height());
						_Editor.findcamera().updateProjectionMatrix();
					},
					complete: function ()
					{
						_ScriptEditor.resize();
					}
				});
				_ScriptEditor.BuildGUI();
				_ScriptEditor.open = true;
			}
		}
		this.hide = function ()
		{
			//$('#ScriptEditor').dialog('close');
			//window.clearInterval(window.scripthideinterval);
			//window.scripthideinterval = window.setInterval(function(){
			//		$('#ScriptEditorTabs').css('height',$('#ScriptEditor').height() + 'px');
			//		$('#index-vwf').css('height',window.innerHeight - $('#smoothmenu1').height() - $('#statusbar').height() - //$('#toolbar').height() - ($(window).height() - $('#ScriptEditor').offset().top-25) + 'px');
			//		_Editor.findscene().camera.setAspect($('#index-vwf').width()/$('#index-vwf').height());
			//		
			//	},33);
			//$('#ScriptEditor').hide('slide',{direction:'down'},function(){ window.clearInterval(window.scripthideinterval);window.scripthideinterval=null;});
			if (this.isOpen())
			{
				$('#ScriptEditor').animate(
				{
					'top': $(window).height() + 'px'
				},
				{
					step: function ()
					{
						$('#ScriptEditorTabs').css('height', $('#ScriptEditor').height() + 'px');
						$('#index-vwf').css('height', window.innerHeight - $('#smoothmenu1').height() - $('#statusbar').height() - $('#toolbar').height() - ($(window).height() - $('#ScriptEditor').offset().top - 25) + 'px');
						_Editor.findcamera().aspect = ($('#index-vwf').width() / $('#index-vwf').height());
						_Editor.findcamera().updateProjectionMatrix();
					},
					complete: function ()
					{
						$('#ScriptEditor').hide();
					}
				});
			}
		}
		this.isOpen = function ()
		{
			//return $("#ScriptEditor").dialog( "isOpen" );
			return $('#ScriptEditor').is(':visible');
		}
		this.PostSaveMethod = function ()
		{
			_ScriptEditor.currentNode = vwf.getNode(_ScriptEditor.currentNode.id);
			_ScriptEditor.MethodChanged = false;
			$('#methodtext').css('border-color', 'black');
			_ScriptEditor.BuildGUI(true);
		}
		this.SaveMethodClicked = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (!_ScriptEditor.MethodChanged) return;
			if (!_ScriptEditor.checkMethodSyntax())
			{
				//show dialog;
				return false;
			}
			var methodname = $.trim(_ScriptEditor.selectedMethod);
			var rawtext = _ScriptEditor.methodEditor.getValue();
			var params = rawtext.substring(rawtext.indexOf('(') + 1, rawtext.indexOf(')'));
			params = params.split(',');
			var cleanParams = [];
			for (var i = 0; i < params.length; i++)
			{
				params[i] = $.trim(params[i]);
				if (params[i] != '' && params[i] != null && params[i] !== undefined) cleanParams.push(params[i]);
			}
			var body = rawtext.substring(rawtext.indexOf('{') + 1, rawtext.lastIndexOf('}'));
			body = $.trim(body);
			//body = body.replace(/\s*\n\s+/gm,'\n');
			if (_ScriptEditor.currentNode.methods && _ScriptEditor.currentNode.methods[methodname])
			{
				vwf_view.kernel.deleteMethod(_ScriptEditor.currentNode.id, methodname);
			}
			vwf_view.kernel.createMethod(_ScriptEditor.currentNode.id, methodname, cleanParams, body);
			window.setTimeout(_ScriptEditor.PostSaveMethod, 500);
			return true;
		}
		$('#saveMethod').click(this.SaveMethodClicked);
		this.PostSaveEvent = function ()
		{
			
			_ScriptEditor.currentNode = vwf.getNode(_ScriptEditor.currentNode.id);
			_ScriptEditor.EventChanged = false;
			$('#eventtext').css('border-color', 'black');
			_ScriptEditor.BuildGUI(true);
		}
		this.SaveEventClicked = function ()
		{
			if (!_ScriptEditor.checkPermission()) return;
			if (!_ScriptEditor.EventChanged) return;
			if (!_ScriptEditor.checkEventSyntax())
			{
				//show dialog;
				return false;
			}
			var eventname = _ScriptEditor.selectedEvent;
			eventname = $.trim(eventname);
			var rawtext = _ScriptEditor.eventEditor.getValue();
			var params = rawtext.substring(rawtext.indexOf('(') + 1, rawtext.indexOf(')'));
			params = params.split(',');
			var cleanParams = [];
			for (var i = 0; i < params.length; i++)
			{
				params[i] = $.trim(params[i]);
				if (params[i] != '' && params[i] != null && params[i] !== undefined) cleanParams.push(params[i]);
			}
			var body = rawtext.substring(rawtext.indexOf('{') + 1, rawtext.lastIndexOf('}'));
			body = $.trim(body);
			if (_ScriptEditor.currentNode.events && _ScriptEditor.currentNode.events[eventname])
			{
				vwf_view.kernel.deleteEvent(_ScriptEditor.currentNode.id, eventname);
			}
			vwf_view.kernel.createEvent(_ScriptEditor.currentNode.id, eventname, cleanParams, body);
			window.setTimeout(_ScriptEditor.PostSaveEvent, 500);
			return true;
		}
		$('#saveEvent').click(this.SaveEventClicked);
		
		
		this.PostSaveProperty = function ()
		{
			_ScriptEditor.currentNode = vwf.getNode(_ScriptEditor.currentNode.id);
			_ScriptEditor.PropertyChanged = false;
			$('#propertytext').css('border-color', 'black');
			_ScriptEditor.BuildGUI(true);
		}
		this.SavePropertyClicked = function (create)
		{
			
			if (!_ScriptEditor.checkPermission()) return;
			if (!_ScriptEditor.PropertyChanged) return;
			
			var propertyname = _ScriptEditor.selectedProperty;
			propertyname = $.trim(propertyname);
			var rawtext = _ScriptEditor.propertyEditor.getValue();
			var val = rawtext;
			try{val = JSON.parse(rawtext)}catch(e){
			
				if(!isNaN(parseFloat(rawtext)))
					val = parseFloat(rawtext)
				else
				{
					if(rawtext == 'true')
						val = true;
					if(rawtext == 'false')
						val = false;
				}
			
			}
			if(create === true)
			vwf_view.kernel.createProperty(_ScriptEditor.currentNode.id, propertyname, val);
			else
			vwf_view.kernel.setProperty(_ScriptEditor.currentNode.id, propertyname, val);
			window.setTimeout(_ScriptEditor.PostSaveProperty, 500);
			return true;
		}
		$('#saveProperty').click(this.SavePropertyClicked);
		
		
		
		
		
		this.PromptAbandon = function (callback)
		{
			//$('#ScriptEditorAbandonChanges').dialog('open');
			//_ScriptEditor.AbandonChangesCallback = callback;
			alertify.confirm($('#ScriptEditorAbandonChanges').text(),function(val){
			
				if(val === true)
					callback()
			
			});
		}
		this.setSelectedMethod_internal = function (name, text)
		{
			
			_ScriptEditor.selectedMethod = name;
			_ScriptEditor.methodEditor.setValue(js_beautify(text,{braces_on_own_line:true,opt_keep_array_indentation:true}));
			_ScriptEditor.methodEditor.selection.clearSelection();
			if (this.methodlist && this.methodlist[name] !== undefined)
			{
				_ScriptEditor.MethodChanged = false;
				$('#methodtext').css('border-color', 'black');
			}
			else
			{
				_ScriptEditor.MethodChanged = true;
				$('#methodtext').css('border-color', 'red');
			}
			
			//$('#methodtextback').text(_ScriptEditor.formatScript(indentedtext));
			$('#methodtext').find(".ace_content").css('background', 'url(vwf/view/editorview/images/stripe.png) 100% 100% repeat');
			$('#methodtext').removeAttr('disabled');
		}
		this.setSelectedMethod = function (name, text)
		{
			if (_ScriptEditor.MethodChanged) _ScriptEditor.PromptAbandon(function ()
				{
					_ScriptEditor.setSelectedMethod_internal(name, text);
				})
			else _ScriptEditor.setSelectedMethod_internal(name, text);
		}
		
		this.setSelectedProperty_internal = function (name, text)
		{
			_ScriptEditor.selectedProperty = name;
			_ScriptEditor.propertyEditor.setValue(js_beautify(text.toString(),{braces_on_own_line:true,opt_keep_array_indentation:true}));
			_ScriptEditor.propertyEditor.selection.clearSelection();
			if (this.properties && this.properties[name] !== undefined)
			{
				_ScriptEditor.PropertyChanged = false;
				$('#propertytext').css('border-color', 'black');
			}
			else
			{
				_ScriptEditor.PropertyChanged = true;
				$('#propertytext').css('border-color', 'red');
			}
			
			//$('#methodtextback').text(_ScriptEditor.formatScript(indentedtext));
			$('#propertytext').find(".ace_content").css('background', 'url(vwf/view/editorview/images/stripe.png) 100% 100% repeat');
			$('#propertytext').removeAttr('disabled');
		}
		this.setSelectedProperty = function (name, text)
		{
			if (_ScriptEditor.PropertyChanged) _ScriptEditor.PromptAbandon(function ()
				{
					_ScriptEditor.setSelectedProperty_internal(name, text);
				})
			else _ScriptEditor.setSelectedProperty_internal(name, text);
		}
		this.setSelectedEvent_internal = function (name, text)
		{
			_ScriptEditor.selectedEvent = name;
			_ScriptEditor.eventEditor.setValue(js_beautify(text,{braces_on_own_line:true,opt_keep_array_indentation:true}));
			_ScriptEditor.eventEditor.selection.clearSelection();
			if (this.eventlist && this.eventlist[name] !== undefined)
			{
				_ScriptEditor.EventChanged = false;
				$('#eventtext').css('border-color', 'black');
			}
			else
			{
				_ScriptEditor.EventChanged = true;
				$('#eventtext').css('border-color', 'red');
			}
			
			//$('#eventtextback').text(_ScriptEditor.formatScript(text));
			$('#eventtext').find(".ace_content").css('background', 'url(vwf/view/editorview/images/stripe.png) 100% 100% repeat');
			$('#eventtext').removeAttr('disabled');
		}
		this.setSelectedEvent = function (name, text)
		{
			if (_ScriptEditor.EventChanged) _ScriptEditor.PromptAbandon(function ()
				{
					_ScriptEditor.setSelectedEvent_internal(name, text);
				})
			else _ScriptEditor.setSelectedEvent_internal(name, text);
		}
		this.NodeHasProperty = function (name)
		{
			if (!_ScriptEditor.currentNode) return false;
			var node = vwf.models[0].model.nodes[_ScriptEditor.currentNode.id];
			while (node)
			{
				var props = node.properties;
				if (node);
				for (var i in node)
				{
					if (name == i) return true;
				}
				node = node.proto;
			}
			return false;
		}
		this.BuildGUI = function (refresh)
		{
			if (!refresh)
			{
				this.selectedMethod = null;
				this.selectedEvent = null;
				this.MethodChanged = false;
				this.EventChanged = false;
				$('#eventtext').css('border-color', 'black');
				$('#methodtext').css('border-color', 'black');
				$('#methodtext').attr('disabled', 'disabled');
				$('#propertytext').attr('disabled', 'disabled');
				$('#eventtext').attr('disabled', 'disabled');
				$('#eventtext').find(".ace_content").css('background', 'url(vwf/view/editorview/images/ui-bg_diagonals-thick_8_cccccc_40x40.png) 50% 50% repeat');
				$('#methodtext').find(".ace_content").css('background', 'url(vwf/view/editorview/images/ui-bg_diagonals-thick_8_cccccc_40x40.png) 50% 50% repeat');
				$('#propertytext').find(".ace_content").css('background', 'url(vwf/view/editorview/images/ui-bg_diagonals-thick_8_cccccc_40x40.png) 50% 50% repeat');
				_ScriptEditor.eventEditor.setValue('');
				_ScriptEditor.methodEditor.setValue('');
			}
			if (!this.currentNode) return;
			$('#methodlist').empty();
			$('#eventlist').empty();
			$('#propertylist').empty();
			
			this.methodlist = this.getMethods();
			this.eventlist = this.getEvents();
			this.properties = this.getProperties();
			var style = "cursor:pointer;font-size: 1.5em;border: 1px solid gray;border-radius: 5px;box-shadow: 0px 0px 20px lightgray inset;margin: 2px;padding: 3px;"
			var newstyle = "cursor:pointer;font-size: 1.5em;border: 2px solid gray;border-radius: 5px;box-shadow: 0px 0px 20px gray inset;margin: 2px;padding: 3px;"
			var lightstyle = "color:lightgray;cursor:pointer;font-size: 1.5em;border: 0px solid lightgray;border-radius: 5px;box-shadow: 0px 0px 20px #EEEEEE inset;margin: 2px;padding: 3px;"
			for (var i in this.methodlist)
			{
				$('#methodlist').append('<div class="scriptchoice" style="' + style + '" id="method' + i + '"></div>');
				$('#method' + i).text(i);
				$('#method' + i).qtip(
				{
					content: "Edit the " + i + " method",
					show: {
						delay: 1000
					}
				});
				$('#method' + i).attr('method', i);
				$('#method' + i).click(function ()
				{
					
					$("#methodlist").children().css('border-color', 'gray');
					$(this).css('border-color', 'blue');
					var method = $(this).attr('method');
					_ScriptEditor.setSelectedMethod(method, "function " + method + "()\n{\n" + _ScriptEditor.methodlist[method] + "\n}");
				});
				if (refresh)
				{
					if (this.selectedMethod == i)
					{
						$('#method' + i).click();
					}
				}
			}
			for (var i in this.properties)
			{
				$('#propertylist').append('<div class="scriptchoice" style="' + style + '" id="property' + i + '"></div>');
				$('#property' + i).text(i);
				$('#property' + i).qtip(
				{
					content: "Edit the " + i + " property",
					show: {
						delay: 1000
					}
				});
				$('#property' + i).attr('property', i);
				$('#property' + i).click(function ()
				{
					$("#propertylist").children().css('border-color', 'gray');
					$(this).css('border-color', 'blue');
					var property = $(this).attr('property');
					var val = vwf.getProperty(_ScriptEditor.currentNode.id,property);
					if(typeof(val) == 'object')
						val = JSON.stringify(val);
					_ScriptEditor.setSelectedProperty(property, val );
				});
				if (refresh)
				{
					if (this.selectedMethod == i)
					{
						$('#property' + i).click();
					}
				}
			}
			for (var i in this.eventlist)
			{
				$('#eventlist').append('<div  style="' + style + '"  id="event' + i + '"></div>');
				$('#event' + i).text(i);
				$('#event' + i).attr('event', i);
				$('#event' + i).qtip(
				{
					content: "Edit the " + i + " event",
					show: {
						delay: 1000
					}
				});
				$('#event' + i).click(function ()
				{
					$("#eventlist").children().css('border-color', 'gray');
					$(this).css('border-color', 'blue');
					var event = $(this).attr('event');
					var params = "";
					for (var j in _ScriptEditor.eventlist[event].parameters)
					{
						params += _ScriptEditor.eventlist[event].parameters[j] + ','
					}
					var eventstring = 'function ' + event + '(';
					for (var i in _ScriptEditor.currentNode.events[event].parameters)
					{
						eventstring += _ScriptEditor.eventlist[event].parameters[i] + ',';
					}
					eventstring = eventstring.substring(0, eventstring.length - 1);
					eventstring += ')\n{\n' + _ScriptEditor.currentNode.events[event].body + '\n}';
					_ScriptEditor.setSelectedEvent(event, eventstring);
				});
				if (refresh)
				{
					if (this.selectedEvent == i)
					{
						$('#event' + i).click();
					}
				}
			}
			var methodsuggestions = ['tick','initialize','deinitialize','prerender','added'];
			var methoddescription = {'tick':"The tick function is called 20 times every second. \n// Write code here to animate over time",'initialize':"Initialize is called when the node is constructed.\n//Write code here to setup the object, or hook up event handlers.\n//Note that the object is not yet hooked into the scene - that will happen during the 'Added' event.\n// You cannot access this.parent in this function.",'deinitialize':"Deinitialize is called when the object is being destroyed.\n// Clean up here if your object allocated any resources manually during initialize.",'prerender':"This function is called at every frame. Don't animate object properties here - that can break syncronization.\n//This can happen because each user might have a different framerate.\n//Most of the time, you should probably be using Tick instaed.",'added':"Added is called when the object is hooked up to the scene.\n// Note that this happens after initialize. At this point, you can access the objects parent."};
			for(var i = 0; i < methodsuggestions.length; i++)
			{
				var thissug = methodsuggestions[i];
				if (!this.methodlist || (this.methodlist && this.methodlist[thissug] === undefined))
				{
					$('#methodlist').append('<div class="scriptchoice" style="' + lightstyle + '" id="method'+thissug+'"></div>');
					$('#method'+thissug).text(thissug);
					$('#method'+thissug).attr('method', thissug);
					$('#method'+thissug).qtip(
					{
						content: "Create the "+thissug+" method.",
						show: {
							delay: 1000
						}
					});
					$('#method'+thissug).click(function ()
					{
						var method = $(this).attr('method');
						alertify.confirm('Would you like to create a new function called ' +method+'?' ,function(ok)
						{
							if(ok)
							{
								$("#methodlist").children().css('border-color', 'gray');
								$(this).css('border-color', 'blue');
								
								_ScriptEditor.setSelectedMethod(method, 'function '+method+'(){\n\n //This function was created for you by the system. \n//'+methoddescription[method]+'\n}');
							}
						}.bind(this));	
					});
				}
			}
			var pointersugs = ['pointerDown', 'pointerUp', 'pointerOver', 'pointerOut', 'pointerClick', 'pointerMove', 'keyDown', 'keyUp', 'keyPress'];
			for (var i in pointersugs)
			{
				if (!this.eventlist || (this.eventlist && this.eventlist[pointersugs[i]] === undefined))
				{
					var name = pointersugs[i];
					$('#eventlist').append('<div class="scriptchoice" style="' + lightstyle + '" id="event' + name + '"></div>');
					$('#event' + name).text(name);
					$('#event' + name).qtip(
					{
						content: "Create the " + name + " event.",
						show: {
							delay: 1000
						}
					});
					$('#event' + name).attr('event', name);
					$('#event' + name).click(function ()
					{
						var event = $(this).attr('event');
						alertify.confirm('Would you like to create a new function called ' +event+'?' ,function(ok)
						{
							if(ok)
							{
								$("#eventlist").children().css('border-color', 'gray');
								$(this).css('border-color', 'blue');
								
								_ScriptEditor.setSelectedEvent(event, 'function ' + event + '(eventData,nodeData){\n\n console.log("got here"); \n\n}');
							}
						}.bind(this));	
					});
				}
			}
		}
		this.getMethods = function()
		{
			
			var methods = {};
			var node = this.currentNode;
			while(node)
			{
			for ( var i in node.methods)
			{
				if(methods[i] === undefined)
				methods[i] = node.methods[i];
			
			}
			node = vwf.getNode(vwf.prototype(node.id),true);
			}

			return methods;

		}
		this.getProperties = function()
		{
			
			var properties = {};
			var node = this.currentNode;
			while(node)
			{
			for ( var i in node.properties)
			{
				if(properties[i] === undefined)
				properties[i] = node.properties[i];
			
			}
			node = vwf.getNode(vwf.prototype(node.id),true);
			}
			return properties;
		}
		this.getEvents = function()
		{
			var events = {};
			var node = this.currentNode;
			while(node)
			{
			for ( var i in node.events)
			{
				if(events[i] === undefined)
				events[i] = node.events[i];
			
			}
			node = vwf.getNode(vwf.prototype(node.id),true);
			}
			return events;
		
		
		}
		this.changeSelection = function (node)
		{
			if (node && this.isOpen())
			{
				if (!this.currentNode || (this.currentNode.id != node.id))
				{
					this.currentNode = node;
					
					this.BuildGUI();
				}
				else
				{
					this.BuildGUI(true);
				}
			}
			else
			{
				if (this.isOpen()) this.hide();
			}
		}
		this.SelectionChanged = function (e, node)
		{
			if (!self.isOpen())
			{
				self.currentNode = node
				return;
			}
			try
			{
				if ((self.MethodChanged || self.EventChanged) && ((node && self.currentNode && node.id != self.currentNode.id) || (!node && self.currentNode)))
				{
					$('#ScriptEditorAbandonChanges').text('You have selected a new object, but you have unsaved changes on this script. Do you want to abandon these changes? If you choose not to, your changes will remain in the editor, but the script editor will show properties for the previoiusly selected node, not the newly selected one.');
					self.PromptAbandon(function ()
					{
						self.changeSelection(node)
					});
				}
				else
				{
					self.changeSelection(node);
				}
			}
			catch (e)
			{
				console.log(e);
			}
		}
		$(document).bind('selectionChanged', this.SelectionChanged.bind(this));
		this.methodEditor = ace.edit("methodtext");
		this.methodEditor.setTheme("ace/theme/chrome");
		this.methodEditor.getSession().setMode("ace/mode/javascript");
		var self = this;
		//show the little popup that displays the parameters to a function call
		this.setupFunctionTip = function(text,editor,offset,width)
		{
		
			
			if($('#FunctionTip').length == 0)
			{
				$(document.body).append("<form id='FunctionTip' />");
			}
			$('#FunctionTip').text(text);
			$('#FunctionTip').css('top',(offset.top - $('#FunctionTip').height()) + 'px');
			$('#FunctionTip').css('left',(offset.left) + 'px');
			$('#FunctionTip').show();
		}
		//Setup the div for the autocomplete interface
		this.setupAutocomplete = function(keys,editor)
		{
			this.activeEditor = editor;
			if(!self.filter)
				self.filter = '';
			
			//Get the position of hte cursor on the editor			
			var offset = $(editor.renderer.$cursorLayer.cursor).offset();
			var width = $(editor.renderer.$cursorLayer.cursor).width();
			if($('#AutoComplete').length == 0)
			{
				//append the div and create it
				$(document.body).append("<form id='AutoComplete' tabindex=890483 />");
				$('#AutoComplete').on('blur',function(e,key)
				{
					$('#AutoComplete').hide();
				});
				//bind up events
				$('#AutoComplete').on('keydown',function(e,key)
				{
					//enter or dot will accept the suggestion
					if(e.which == 13 || e.which == 190 || e.which == 39)
					{
						//find the selected text
						var index = $(this).attr('autocompleteindex');
						$('#AutoComplete').hide();
						
						//backspace letters up to the dot or bracket
						var text = $($(this).children()[index]).text();
						for(var i = 0; i < self.filter.length; i++)
							_ScriptEditor.activeEditor.remove('left');
						//insert	
						_ScriptEditor.activeEditor.insert(text);
						
						//focus on the editor
						window.setTimeout(function(){
						
							_ScriptEditor.activeEditor.focus();
						
						},15);
						return true;
					
					
					}else if(e.which == 40) //down
					{
						//move up or down the list
						var children = $(this).children();
						var index = $(this).attr('autocompleteindex');
						index++;
						if(index > children.length-1)
							index = children.length-1;
						$(this).attr('autocompleteindex',index);
						
						//deal with the scrolling
						if((index+1) * $(children[0]).height() > 150 + $('#AutoComplete').scrollTop() )
							$('#AutoComplete').scrollTop((index+1) * $(children[0]).height() - 150);
						
						//show the selection
						for(var i = 0; i < children.length; i++)
						{
							if(i == index)
							{
								$(children[i]).css('background','lightblue');
							}else
								$(children[i]).css('background','white');
						}
					}
					else if(e.which == 38) //up
					{
						//move up or down the list
						var children = $(this).children();
						var index = $(this).attr('autocompleteindex');
						index--;
						if(index < 0 )
							index = 0;
						$(this).attr('autocompleteindex',index);
						
						//deal with scrolling drama
						if((index) * $(children[0]).height() < $('#AutoComplete').scrollTop() )
							$('#AutoComplete').scrollTop(index * $(children[0]).height());
						
						//show the selected text
						for(var i = 0; i < children.length; i++)
						{
							if(i == index)
							{
								$(children[i]).css('background','lightblue');
							}else
								$(children[i]).css('background','white');
						}
					}
					else if(e.which == 27) //esc
					{
						//just hide the editor
						$('#AutoComplete').hide();
						_ScriptEditor.activeEditor.focus();
						
					}
					else if(e.which == 16) //esc
					{
						//do nothing for shift
						
					}else
					{
						//this is all other keys, 
						var key = e.which;
						key = String.fromCharCode(key);
						
						//if the key is a character or backspace, edit the filter
						if(e.which == 8 || (e.which < 91 && e.which > 64) || e.which == 189 )
						{
							//if it's not a backspace, add it to the filter
							if(e.which != 8 && e.which != 189)
								self.filter += key;
							else if (e.which == 189)
								self.filter += '_';
							else	
							{	//if the backspace occurs with no filter, then close and remove
								if(self.filter.length ==0)
								{
									window.setTimeout(function()
									{
										_ScriptEditor.activeEditor.remove('left');
										$('#AutoComplete').hide();
										_ScriptEditor.activeEditor.focus();
										
									},15);
									e.preventDefault();
									return;
								}
								//else, backspace from both the editor and the filter string
								self.filter = self.filter.substr(0,self.filter.length-1);
								_ScriptEditor.activeEditor.remove('left');
								
							}
							//wait 15ms, then show this whole dialog again
							window.setTimeout(function()
							{
								console.log(self.filter);
								$('#AutoComplete').focus();
								
								self.setupAutocomplete(self.keys,editor,self.filter);
								
							},15);
						}else
						{	
							//any key that is not a character or backspace cancels the autocomplete
							window.setTimeout(function()
							{
								$('#AutoComplete').hide();
									_ScriptEditor.activeEditor.focus();
								
							},15);
						
						}
						//this is important for keypresses, so that they will filter down into ACE
						_ScriptEditor.activeEditor.focus();
						
					}
					
				});
				
			}
			
			
			//now that the gui is setup, populate it with the keys
			$('#AutoComplete').empty();
			var first = false;
			for(var i in self.keys)
			{	
				//use the filter string to filter out suggestions
				if(self.keys[i][0].toLowerCase().indexOf(self.filter.toLowerCase()) != 0)
					continue;
				
				//Append a div	
				$('#AutoComplete').append("<div id='AutoComplete_"+i+"' class='AutoCompleteOption'/>");
				$('#AutoComplete_'+i).text(self.keys[i][0]);
				if(self.keys[i][1] == Function)
				{
					$('#AutoComplete_'+i).addClass('AutoCompleteOptionFunction');
				}
				$('#AutoComplete_'+i).attr('autocompleteindex',i);
				if(!first)
					$('#AutoComplete_'+i).css('background','lightblue');
				first = true;	
				
				//Clicking on the div just inserts the text, and hides the GUI
				$('#AutoComplete_'+i).click(function()
				{
					
					
						$('#AutoComplete').hide();
						
						var text = $(this).text();
						//Remove up the the last dot or bracket
						for(var i = 0; i < self.filter.length; i++)
							_ScriptEditor.activeEditor.remove('left');
						_ScriptEditor.activeEditor.insert(text);
						
						window.setTimeout(function(){
						
							_ScriptEditor.activeEditor.focus();
						
						},15);
						return true;
					
				});
			}
			$('#AutoComplete').focus();
			
			$('#AutoComplete').css('top',offset.top + 'px');
			$('#AutoComplete').css('left',(offset.left + width) + 'px');
			
			$('#AutoComplete').css('max-height',Math.min(150,($(window).height() - offset.top) )+ 'px');
			$('#AutoComplete').show();
			$('#AutoComplete').attr('autocompleteindex',0);
			$('#AutoComplete').css('overflow','hidden');
			$('#AutoComplete').scrollTop(0);
			window.setTimeout(function()
			{
				$('#AutoComplete').focus();
				
			},15);
		}
		this.beginAutoComplete =function(editor,chr,line,filter)
		{
		
		
					//get the keys
					self.keys = vwf.callMethod(self.currentNode.id,'JavascriptEvalKeys',[line]);
					
					
					
					
					if(self.keys)
					{
					
						//if the character that started the autocomplete is a dot, then remove the keys that have
						//spaces or special characters, as they are not valid identifiers
						if(chr == '.')
						{
							var remove = [];
							var i = 0;
							
							while(i < self.keys.length)
							{
								if(self.keys[i][0].search(/[^0-9a-zA-Z_]/) != -1 || self.keys[i][0].search(/[0-9]/) == 0)
								{
									self.keys.splice(i,1);
								}else
								{
								i++;
								}
							}
						
						
						}else
						{
							//if the character was a bracket, suround the key with quotes
							for(var i = 0;i < self.keys.length; i++)
							{
								if(self.keys[i][0].search(/[^0-9]/) != -1)
								{
									self.keys[i][0] = '"'+self.keys[i][0]+'"';
								}
							}
						}
					
						//sort the keys by name
						self.keys.sort(function(a,b)
						{
							return a[0] > b[0]?1:-1;
						})
						window.setTimeout(function()
						{
							self.filter = filter;
							self.setupAutocomplete(self.keys,editor,filter);
							
						},15);
						
					}
				
		
		}
		//The dot or the bracket was hit, so open the suggestion box
		this.triggerAutoComplete = function(editor)
		{
			var cur = editor.getCursorPosition();
			var session = editor.getSession();
			var line = session.getLine(cur.row);
			var chr = line[cur.column] ;
			//Open on . or [
			if(chr== '.' || chr == '[')
			{
				
				//get the line up to the dot
				line = line.substr(0,cur.column);
				var splits = line.split(' ');
				line = splits[splits.length-1];
				splits = line.split(';');
				line = splits[splits.length-1];
				//don't show autocomplete for lines that contain a (, because we'll be calling a functio ntaht might have side effects
				if(line.indexOf('(') == -1 && line.indexOf('=') == -1)
				{
					this.beginAutoComplete(editor,chr,line,'');
				}
			
			}
		
		}
		//Test for an open paren, then show the parameter help
		this.triggerFunctionTip = function(editor)
		{
			var cur = editor.getCursorPosition();
			var session = editor.getSession();
			var line = session.getLine(cur.row);
			//Only show for open paren
			if(line[cur.column] == '(')
			{
				//Get the line
				line = line.substr(0,cur.column);
				var splits = line.split(' ');
				line = splits[splits.length-1];
				splits = line.split(';');
				line = splits[splits.length-1];
				//Don't show for lines that have ( or ) (other than the one that triggered the autocomplete) because function calls
				//might have side effects
				if(line.indexOf('(') == -1 && line.indexOf('=') == -1)
				{
					//Get the text for the tooltip
					var text = vwf.callMethod(self.currentNode.id,'JavascriptEvalFunction',[line]);
		
			
					if(text)
					{
						window.setTimeout(function()
						{
							self.setupFunctionTip(text,editor,$(editor.renderer.$cursorLayer.cursor).offset(),$(editor.renderer.$cursorLayer.cursor).width());
							
						},15);
						
					}
				
				}
			
			}
		
		}
		
		//route change events to check for autocomplete
		this.methodEditor.getSession().on('change',function(e)
		{
			self.MethodChange();
			self.triggerAutoComplete(self.methodEditor);
			self.triggerFunctionTip(self.methodEditor);
		});
		
		
		this.eventEditor = ace.edit("eventtext");
		this.eventEditor.setTheme("ace/theme/chrome");
		this.eventEditor.getSession().setMode("ace/mode/javascript");
		
		//route change events to check for autocomplete
		this.eventEditor.getSession().on('change',function(e)
		{
			self.EventChange();
			self.triggerAutoComplete(self.eventEditor);
			self.triggerFunctionTip(self.eventEditor);
		});
		
		this.methodEditor.setPrintMarginColumn(false);
		this.methodEditor.setFontSize('15px');
		this.eventEditor.setPrintMarginColumn(false);
		this.eventEditor.setFontSize('15px');
		
		this.propertyEditor = ace.edit("propertytext");
		this.propertyEditor.setTheme("ace/theme/chrome");
		this.propertyEditor.getSession().setMode("ace/mode/javascript");
		this.propertyEditor.setPrintMarginColumn(false);
		this.propertyEditor.setFontSize('15px');
		
		//route change events to check for autocomplete
		this.propertyEditor.getSession().on('change',function(e)
		{
			self.PropertyChange();
			self.triggerAutoComplete(self.propertyEditor);
		});
		
		this.methodEditor.keyBinding.origOnCommandKey = this.methodEditor.keyBinding.onCommandKey;
		this.eventEditor.keyBinding.origOnCommandKey = this.eventEditor.keyBinding.onCommandKey;
		
		
		//hide or show the function top based on the inputs
		this.methodEditor.on('change',function(e){
		   
		    //hide if removing an open paren
		   if(e.data.action == "removeText")
		   {
			if(e.data.text.indexOf('(') != -1)
				$('#FunctionTip').hide();
		   
		   }
		   //hide if inserting a close paren
		   if(e.data.action == "insertText")
		   {
			if(e.data.text.indexOf(')') != -1)
				$('#FunctionTip').hide();
		   
		   }
		   
		   var cur = self.methodEditor.getCursorPosition();
		   var session = self.methodEditor.getSession();
		   var line = session.getLine(cur.row);
	           var chr1 = line[cur.column-1];
		   var chr2 = line[cur.column];
		
		    if(chr2 == ')')
			$('#FunctionTip').hide();
		
		});
		
		//hide or show the function top based on the inputs
		this.eventEditor.on('change',function(e){
		   
		   //hide if removing an open paren
		   if(e.data.action == "removeText")
		   {
			if(e.data.text.indexOf('(') != -1)
				$('#FunctionTip').hide();
		   
		   }
		   //hide if inserting a close paren
		   if(e.data.action == "insertText")
		   {
			if(e.data.text.indexOf(')') != -1)
				$('#FunctionTip').hide();
		   
		   }
		   
		   var cur = self.eventEditor.getCursorPosition();
		   var session = self.eventEditor.getSession();
		   var line = session.getLine(cur.row);
	           var chr1 = line[cur.column-1];
		   var chr2 = line[cur.column];
		
		    if(chr2 == ')')
			$('#FunctionTip').hide();
		
		});
		
		//hide or show the function top based on the inputs
		this.methodEditor.keyBinding.onCommandKey = function(e, hashId, keyCode) {
		   
		   var cur = self.methodEditor.getCursorPosition();
		   var session = self.methodEditor.getSession();
		   var line = session.getLine(cur.row);
	           var chr1 = line[cur.column-1];
		   var chr2 = line[cur.column];
			
		   //hide on up or down arrow	
		   if(keyCode == 38 || keyCode == 40)
			$('#FunctionTip').hide();
		   //hide when moving cursor beyond start of (
		   if( keyCode == 37)
		   {
			if(chr1 == '(')
				$('#FunctionTip').hide();
		   }
		   //hide when moving cursor beyond end of )
		   if( keyCode == 39)
		   {
			if(chr2 == ')')
				$('#FunctionTip').hide();
		   }
		   this.origOnCommandKey(e, hashId, keyCode);
			
		}
		//hide or show the function top based on the inputs
		this.eventEditor.keyBinding.onCommandKey = function(e, hashId, keyCode) {
		   
			
			var cur = self.eventEditor.getCursorPosition();
			var session = self.eventEditor.getSession();
			var line = session.getLine(cur.row);
			   var chr1 = line[cur.column-1];
			var chr2 = line[cur.column];

			//hide on up or down arrow	
			if(keyCode == 38 || keyCode == 40)
			$('#FunctionTip').hide();
			//hide when moving cursor beyond start of (
			if( keyCode == 37)
			{
			if(chr1 == '(')
				$('#FunctionTip').hide();
			}
			//hide when moving cursor beyond end of )
			if( keyCode == 39)
			{
			if(chr2 == ')')
				$('#FunctionTip').hide();
			}
			
		   
		   this.origOnCommandKey(e, hashId, keyCode);
			
		}
		
		$('#eventtext textarea.ace_text-input').keydown(function(e){
			 if(e.which == 83 && e.ctrlKey == true)
			 {
				e.preventDefault();
				self.SaveEventClicked();
			 }
			  if(e.which == 32 && e.ctrlKey == true)
			 {
				e.preventDefault();
				
				var cur = self.eventEditor.getCursorPosition();
				var session = self.eventEditor.getSession();
				var line = session.getLine(cur.row);
			   
				
				
				var splits = line.split(' ');
				line = splits[splits.length-1];
				splits = line.split(';');
				line = splits[splits.length-1];
				var triggerkeyloc = Math.max(line.lastIndexOf('.'),line.lastIndexOf('['));
				var triggerkey = line[triggerkeyloc];
				var filter = line.substr(triggerkeyloc+1);
				line = line.substring(0,triggerkeyloc);
				line = line || 'window';
				triggerkey = triggerkey || '.';
				//Don't show for lines that have ( or ) (other than the one that triggered the autocomplete) because function calls
				//might have side effects
				if(line.indexOf('(') == -1 && line.indexOf('=') == -1)
				{
					self.beginAutoComplete(self.eventEditor,triggerkey,line,filter);
				}
			 }
		})
		$('#methodtext textarea.ace_text-input').keydown(function(e){
			 if(e.which == 83 && e.ctrlKey == true)
			 {
				e.preventDefault();
				self.SaveMethodClicked();
			 }
			 if(e.which == 32 && e.ctrlKey == true)
			 {
				e.preventDefault();
				
				var cur = self.methodEditor.getCursorPosition();
				var session = self.methodEditor.getSession();
				var line = session.getLine(cur.row);
			   
				
				
				var splits = line.split(' ');
				line = splits[splits.length-1];
				splits = line.split(';');
				line = splits[splits.length-1];
				var triggerkeyloc = Math.max(line.lastIndexOf('.'),line.lastIndexOf('['));
				var triggerkey = line[triggerkeyloc];
				var filter = line.substr(triggerkeyloc+1);
				line = line.substring(0,triggerkeyloc);
				line = line || 'window';
				triggerkey = triggerkey || '.';
				//Don't show for lines that have ( or ) (other than the one that triggered the autocomplete) because function calls
				//might have side effects
				if(line.indexOf('(') == -1 && line.indexOf('=') == -1)
				{
					self.beginAutoComplete(self.methodEditor,triggerkey,line,filter);
				}
			 }
			 
		})
		
		
		$('#methodtext').on('click',function(){$('#FunctionTip').hide();})
		$('#eventtext').on('click',function(){$('#FunctionTip').hide();})
		this.eventEditor.on('blur',function(e){$('#FunctionTip').hide();});
		this.methodEditor.on('blur',function(e){$('#FunctionTip').hide();});
		
		
		$('#ScriptEditor').hide();
		$('#ScriptEditor').css('height', '405px');
		self.methodEditor.setBehavioursEnabled(false);
		self.eventEditor.setBehavioursEnabled(false);
		self.propertyEditor.setBehavioursEnabled(false);
	}
});
