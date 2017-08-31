//

// main anonymous function
(function () {
	var Log, logger;
	function componentImport(c) {
		var cObj = null;
		try {
			cObj = Components.utils.import(c, {});
		} catch (e) {
			if (logger && logger.error) {
				logger.error("importing \""+c+"\" failed");
			}
		}
		return cObj;
	}
	if ((Log = componentImport("resource://gre/modules/Log.jsm")) !== null) {
		Log = Log.Log;
		logger = Log.repository.getLogger("config");
		logger.level = Log.Level.All;
		logger.addAppender(new Log.ConsoleAppender(new Log.BasicFormatter()));
		logger.addAppender(new Log.DumpAppender(new Log.BasicFormatter()));
	} else {
		logger = {
			fatal: function () {},
			error: function () {},
			warn: function () {},
			info: function () {},
			config: function () {},
			debug: function () {},
			trace: function () {}
		};
	}
	// Disable add-on signature checks
	(function () {
		var XPIProvider = componentImport("resource://gre/modules/addons/XPIProvider.jsm");
		var XPIInstall = componentImport("resource://gre/modules/addons/XPIInstall.jsm");
		var p = 0;
		logger.warn("disabling add-on signature checks");
		try {
			if (XPIProvider && XPIProvider.eval) {
				XPIProvider.eval("function mustSign(aType) { return false; }");
				XPIProvider.eval("XPIProvider.verifySignatures = function() {}");
				XPIProvider.eval("SIGNED_TYPES.clear()");
				p = p+1;
			}
			if (XPIInstall && XPIInstall.eval) {
				XPIInstall.eval("SIGNED_TYPES.clear()");
				p = p+2;
			}
		} catch (e) {
			logger.error("error occurred while disabling add-on signature checks");
		}
		switch (p) {
			case 0:
				logger.error("disabling add-on signature checks failed");
				break;
			case 1:
				logger.warn("disabling add-on signature checks was partial");
				logger.warn("it may still be possible to use unsigned add-ons");
				break;
			case 2:
				logger.warn("disabling add-on signature checks was partial");
				logger.warn("it may not be possible to use unsigned add-ons");
				break;
			case 3:
				logger.warn("disabling add-on signature checks was complete");
				break;
		}
	})();
})();
