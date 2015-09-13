angular.module('expenseclaiming', ['angularMoment','ui.bootstrap'])

// The default logo for the expense claim
.constant('DEFAULT_LOGO', 'images/randstad_logo.png')


// The expense claim displayed when the user first uses the app
.constant('DEFAULT_EXPENSE_CLAIM', {
  tax: 13.00,
  expense_claim_number: 1,
  employee_info: {
    name: 'Mr. John Doe',
    branch_code: 'XYZ-123',
    claim_date: '2015-08-31'
  },
  bank_info: {
    bank_code: 'BANK-00123',
    acct_num: 'ACCT-0099-991010',
    acct_name: 'JOHN DOE JR.'
  },  
  claims:[
    { trx_date: '01/08/2015', cost_center: 'MMS CyberJaya', gl_code: '4165', description: '1-day Training course', currency:'USD', amt: 299, gst: 2,  exch_rate: 4.31 }
  ]
})

// Service for accessing local storage
.service('LocalStorage', [function() {

  var Service = {};

  // Returns true if there is a logo stored
  var hasLogo = function() {
    return !!localStorage['logo'];
  };

  // Returns a stored logo (false if none is stored)
  Service.getLogo = function() {
    if (hasLogo()) {
      return localStorage['logo'];
    } else {
      return false;
    }
  };

  Service.setLogo = function(logo) {
    localStorage['logo'] = logo;
  };


  // Checks to see if an expense claim is stored
  var hasExpenseClaim = function() {
    return !(localStorage['expense_claim'] == '' || localStorage['expense_claim'] == null);
  };  


  // Returns a stored expense claim (false if none is stored)
  Service.getExpenseClaim = function() {
    if (hasExpenseClaim()) {
      return JSON.parse(localStorage['expense_claim']);
    } else {
      return false;
    }
  };


  Service.setExpenseClaim = function(expenseClaim) {
    localStorage['expense_claim'] = JSON.stringify(expenseClaim);
  };

  // Clears a stored logo
  Service.clearLogo = function() {
    localStorage['logo'] = '';
  };


  // Clears a stored expense claim
  Service.clearExpenseClaim = function() {
    localStorage['expense_claim'] = '';
  };

  // Clears all local storage
  Service.clear = function() {
    localStorage['expense_claim'] = '';
    Service.clearLogo();
  };

  return Service;

}])

.service('Currency', [function(){

  var service = {};

  service.all = function() {
    return [
      {
        name: 'Canadian Dollar ($)',
        symbol: 'CAD $ '
      },
      {
        name: 'Euro (€)',
        symbol: '€'
      },
      {
        name: 'Indian Rupee (₹)',
        symbol: '₹'
      },
      {
        name: 'Norwegian krone (kr)',
        symbol: 'kr '
      },
      {
        name: 'US Dollar ($)',
        symbol: '$'
      }
    ]
  }

  return service;
  
}])

.service('GLCode', [function(){

  var service = {};

  service.all = function() {
    return [
      {
        code: '4165',
        desc: 'Staff Reimbursement Mobile Claim'
      },
      {
        code: '4190',
        desc: 'Postage'
      },
      {
        code: '4191',
        desc: 'Couriers'
      },
      {
        code: '4200',
        desc: 'Stationery'
      },
      {
        code: '4311',
        desc: 'International Fares'
      }
    ]
  }

  return service;
  
}])


// Main application controller for Expense Claim
.controller('ExpenseClaimCtrl', ['$scope', '$http', 'DEFAULT_EXPENSE_CLAIM', 'DEFAULT_LOGO', 'LocalStorage', 'Currency','GLCode',
  function($scope, $http, DEFAULT_EXPENSE_CLAIM, DEFAULT_LOGO, LocalStorage, Currency, GLCode) {

  // Set defaults
  $scope.currencySymbol = '$';
  $scope.logoRemoved = false;
  $scope.printMode   = false;

  (function init() {
    // Attempt to load expense claim from local storage
    !function() {
      var expenseClaim = LocalStorage.getExpenseClaim();
      $scope.expenseClaim = expenseClaim ? expenseClaim : DEFAULT_EXPENSE_CLAIM;
      $scope.todayDate = moment("1995-12-25");
    }();

    // Set logo to the one from local storage or use default
    !function() {
      var logo = LocalStorage.getLogo();
      $scope.logo = logo ? logo : DEFAULT_LOGO;
    }();

    $scope.availableCurrencies = Currency.all();
    $scope.availbleGLCodes = GLCode.all();

  })()
  // Adds an item to the claim's items
  $scope.addClaim = function() {
    $scope.expenseClaim.claims.push({ trx_date: '01/08/2015', cost_center: "", gl_code: "", description: "", currency:"", amt: 0, gst: 0,  exch_rate: 0 });
  }

  // Toggle's the logo
  $scope.toggleLogo = function(element) {
    $scope.logoRemoved = !$scope.logoRemoved;
    LocalStorage.clearLogo();
  };

  // Triggers the logo chooser click event
  $scope.editLogo = function() {
    // angular.element('#imgInp').trigger('click');
    document.getElementById('imgInp').click();
  };

  // Removes an claim from the expense claim
  $scope.removeClaim = function(claim) {
    $scope.expenseClaim.claims.splice($scope.expenseClaim.claims.indexOf(claim), 1);
  };

  // Calculates the sub total of the expense claim
  $scope.expenseClaimSubTotal = function() {
    var total = 0.00;
    angular.forEach($scope.expenseClaim.claims, function(claim, key){
      total += (claim.exch_rate * claim.amt);
    });
    return total;
  };

  // Calculates the tax of the specific claim
  $scope.calculateTax = function() {
    return (($scope.expenseClaim.tax * $scope.expenseClaimSubTotal())/100);
  };

  // Calculates the grand total of the expense claim
  $scope.calculateGrandTotal = function() {
    saveExpenseClaim();
    return $scope.calculateTax() + $scope.expenseClaimSubTotal();
  };

  // Clears the local storage
  $scope.clearLocalStorage = function() {
    var confirmClear = confirm('Are you sure you would like to clear the expense claim?');
    if(confirmClear) {
      LocalStorage.clear();
      setExpenseClaim(DEFAULT_EXPENSE_CLAIM);
    }
  };

$scope.save = function() {     
  alert(JSON.stringify($scope.expenseClaim));   // you need to save (json obj)?   
 };

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

  // Sets the current expense claim to the given one
  var setExpenseClaim = function(expenseClaim) {
    $scope.expenseClaim = expenseClaim;
    saveExpenseClaim();
  };

  // Reads a url
  var readUrl = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('company_logo').setAttribute('src', e.target.result);
        LocalStorage.setLogo(e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  };

  // Saves the expense claim in local storage
  var saveExpenseClaim = function() {
    LocalStorage.setExpenseClaim($scope.expenseClaim);
  };

  // Runs on document.ready
  angular.element(document).ready(function () {
    // Set focus
    document.getElementById('expense-claim-number').focus();

    // Changes the logo whenever the input changes
    document.getElementById('imgInp').onchange = function() {
      readUrl(this);
    };
  });

}])
