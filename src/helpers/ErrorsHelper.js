var ErrorsHelper = function(){

}

ErrorsHelper.getMessage = function(errorObj){
  var msg = null
  switch (errorObj.code) {
    case 11000:
      msg = "The value already exist"
      break;
  }


  return msg;
}

module.exports.ErrorsHelper = ErrorsHelper;
