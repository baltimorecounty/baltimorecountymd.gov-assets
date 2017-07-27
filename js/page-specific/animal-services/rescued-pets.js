(function ($, BcList) {
  /**
   * MODIFY these values based on your configuration
   */
  var listClass = 'pet-list';
  var tabSelector = '.pet-tabs';
  var dataUrl = "//egov.baltimorecountymd.gov/LostAdoptPetService/GetRescued";
  var templateUrl = "/sebin/l/l/generic-pet.template.js";

  /**
   * !!!! DO NOT MODIFY BELOW THESE LINES !!!!
   */

  //Initialize Bc List
  var adoptedPets = new BcList({
    containerClass: listClass, //Selector of class you want to append your results
    source: dataUrl,
    templatePath: templateUrl
  });

  //Utils
  function getURLParameter(name) {
    return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
  }

  function onReady() {
    var type = getURLParameter('type') === "null" ? "all" : getURLParameter('type');

    if (type !== "all") {
      var $adoptedPets = $(tabSelector + ' li');
      $adoptedPets.find('a.active').removeClass('active');
      $adoptedPets.find('a[data-type=' + type + ']').addClass('active');
    }

    adoptedPets.Show(type, function () {
      //If there is hash, scroll to that element
      if (window.location.hash) {
        document.getElementById(window.location.hash.replace("#", "")).scrollIntoView(true);
      }
    });
  }

  function onTabClick(e) {
    e.preventDefault();
    var $this = $(e.currentTarget);
    var type = $this.data('type').toLowerCase();

    //Remove active tab
    $this.parent().parent().find('a').removeClass('active');

    //Make the link you selected the active tab
    $this.addClass('active');

    //Hcak so the footer doesn't flash in the screen
    $('.' + listClass).css('height', 900000000);

    //Show pets of the tab you selected
    adoptedPets.Show(type, function() {
      $('.' + listClass).removeAttr('style');
    });
  }

  $(document).ready(onReady);

  $(document).on('click', tabSelector + ' li a', onTabClick);

})(jQuery, BcList);