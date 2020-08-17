const moment = require('moment');
module.exports = {
formatDate: function(date, targetFormat){
return moment(date).format(targetFormat);
},
radioCheck: function(value, radioValue){
    if (value == radioValue){
        return "checked";
    }else{
        return "";
    }
},
ifEquals: function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
},
dropDownCheck: function(value, dropDownValue){
    if (value == dropDownValue){
        return "selected";
    }else{
        return "";
    }
}
};
