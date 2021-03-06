'use strict'

require('./electron');

const events = require('events');
const path = require('path');
const Module = require('module');
	
// The global variable will be used by ipc for event dispatching
//var v8Util = process.binding('atom_v8_util')
//v8Util.setHiddenValue(global, 'ipc', new events.EventEmitter())

// Export node bindings to global.
window.require = require;
window.module = module;
window.miniNodeRequire = require;
window.miniNodeModule = module;

// Set the __filename to the path of html file if it is file: protocol.
if (window.location.protocol === 'file:') {
    var pathname = process.platform === 'win32' && window.location.pathname[0] === '/' ? window.location.pathname.substr(1) : window.location.pathname;
    window.__filename = path.normalize(decodeURIComponent(pathname));
    window.__dirname = path.dirname(window.__filename);

    // Set module's filename so relative require can work as expected.
    module.filename = window.__filename;

    // Also search for module under the html file.
    module.paths = module.paths.concat(Module._nodeModulePaths(window.__dirname));
}

function outputObj(obj) {  
    var props = "";  
	for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var propVal = obj[prop];
            props += prop + ' (' + typeof(prop) + ')' + ' = ';
            if (typeof(obj[prop]) == 'string') {
                propVal += obj[prop];
            } else {
                if (propVal != null && propVal.toString) {
                    props += propVal.toString();
                } else {}
            }
            props += '\n';
        }
    }
   	console.log(props);  
}  

global.process.on('exit', function() {
	var activeHandles = global.process._getActiveHandles();
	
	for (var i in activeHandles) {
		var handle = activeHandles[i];
		if (handle.hasOwnProperty('_handle') && handle._handle.hasOwnProperty('close'))
			handle._handle.close();
	}
});