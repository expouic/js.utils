var jsutils = this;

jsutils.jsutilsObject = {};
jsutils.jsutilsArray = {};
jsutils.jsutilsTemplate = {};

/**
 * RequireJS Main Configuration
 */
require.config({

    baseUrl: ".",

    paths: {
        "typedAs": "node_modules/typedas/typedAs",
        "underscore": "node_modules/underscore/underscore-min",
        "jsutilsObjectModule": "utils/Object",
        "jsutilsArrayModule": "utils/Array",
        "jsutilsTemplateModule": "utils/Template",
        "libDomReady": "lib/domReady"
    },

    out: "jsutils-min.js",
    name: "jsutilsweb"

});


require(["libDomReady", "jsutilsObjectModule", "jsutilsArrayModule", "jsutilsTemplateModule"], function (domReady, obj, arr, tpl) {
    domReady(function () {

        var jsutilsOnReadyListener,
            jsutilsOnReadyDefaultListener = function() {
                console.log("js.utils is ready (jsutilsReady callback can be overriden [e.g. jsutilsOnReady=function(obj, arr, tpl){}]");
            };

        jsutils.jsutilsObject = obj;
        jsutils.jsutilsArray =  arr;
        jsutils.jsutilsTemplate =  tpl;

        if (typeof jsutilsOnReady !== "undefined") {
            jsutilsOnReadyListener = jsutilsOnReady;
        } else {
            jsutilsOnReadyListener = jsutilsOnReadyDefaultListener;
        }
        jsutilsOnReadyListener.call(jsutils, obj, arr, tpl);
    });
});