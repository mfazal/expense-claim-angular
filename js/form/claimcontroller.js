var app = angular.module('expenseclaiming');

app.controller('ClaimController', [
  '$scope', '$element', 'title', 'close', 'availableCurrencies','availbleGLCodes','dateFormat','claimObj',
  function($scope, $element, title, close,availableCurrencies,availbleGLCodes,dateFormat,claimObj) {

  // $scope.name = null;
  // $scope.age = null;
  $scope.title = title;
  $scope.availableCurrencies = availableCurrencies;

  $scope.availbleGLCodes =availbleGLCodes;
  $scope.dateFormat = dateFormat;
  //{ trx_date: '01/08/2015', cost_center: "", gl_code: "", description: "", currency:"", amt: 0, gst: 0,  exch_rate: 0 }
  if(claimObj == null){
    $scope.trx_date = null;
    $scope.cost_center="";
    $scope.gl_code="";
    $scope.description="";
    $scope.currency="";
    $scope.amt=0.0;
    $scope.gst=0;
    $scope.exch_rate=0.0;    
  } else {
      $scope.trx_date = claimObj.trx_date;
  $scope.cost_center=claimObj.cost_center;
  $scope.gl_code=claimObj.gl_code;
  $scope.description=claimObj.description;
  $scope.currency=claimObj.currency;
  $scope.amt=claimObj.amt;
  $scope.gst=claimObj.gst;
  $scope.exch_rate=claimObj.exch_rate;
  }


  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

    var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);

    $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  $scope.close = function() {
    close({
      trx_date: $scope.trx_date.getTime(),
      cost_center: $scope.cost_center,
      gl_code: $scope.gl_code,
      description: $scope.description,
      currency: $scope.currency,
      amt: $scope.amt,
      gst: $scope.gst,
      exch_rate: $scope.exch_rate      
    }, 500); // close, but give 500ms for bootstrap to animate
  };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');
    
    //  Now call close, returning control to the caller.
    close(null, 500); // close, but give 500ms for bootstrap to animate
  };

}]);