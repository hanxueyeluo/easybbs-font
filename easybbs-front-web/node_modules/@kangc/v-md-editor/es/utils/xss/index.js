import _extends from "@babel/runtime/helpers/esm/extends";
import xss from 'xss';
import svgTagWhiteList from "./svg";
import kaTexWhiteList from "./KaTex";
import { attrWhiteList, prefixAttrWhiteList, tags } from "./common";

var tagWhiteList = _extends({}, tags, kaTexWhiteList, svgTagWhiteList);

var options = {
  whiteList: _extends({}, xss.getDefaultWhiteList(), tagWhiteList),
  onIgnoreTagAttr: function onIgnoreTagAttr(tag, name, value) {
    if (svgTagWhiteList[tag] || kaTexWhiteList[tag] || attrWhiteList.find(function (attr) {
      return attr === name;
    }) || prefixAttrWhiteList.find(function (prefix) {
      return name.startsWith(prefix);
    })) {
      return name + "=\"" + xss.escapeAttrValue(value) + "\"";
    }
  }
};
var xssFilterInstance = new xss.FilterXSS(options);

xssFilterInstance.extend = function (extendOptions) {
  var instanceOptions = xssFilterInstance.options;
  Object.keys(extendOptions).forEach(function (optionName) {
    // extend whiteList
    if (optionName === 'whiteList') {
      Object.keys(extendOptions.whiteList).forEach(function (tagName) {
        var tagAttrWhiteList = extendOptions.whiteList[tagName];
        var instanceWhiteList = instanceOptions.whiteList;

        if (instanceWhiteList[tagName]) {
          instanceWhiteList[tagName] = [].concat(instanceWhiteList[tagName], tagAttrWhiteList);
        } else {
          instanceWhiteList[tagName] = tagAttrWhiteList;
        }
      });
    } else if (optionName === 'onIgnoreTagAttr') {
      var oldHandler = instanceOptions.onIgnoreTagAttr;

      instanceOptions.onIgnoreTagAttr = function () {
        var _extendOptions$onIgno;

        for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        var oldReturnVal = oldHandler.call.apply(oldHandler, [this].concat(arg));

        var newReturnVal = (_extendOptions$onIgno = extendOptions.onIgnoreTagAttr).call.apply(_extendOptions$onIgno, [this].concat(arg));

        return oldReturnVal || newReturnVal;
      };
    } else {
      instanceOptions[optionName] = extendOptions[optionName];
    }
  });
};

export default xssFilterInstance;