(function ($, BcList) {
  /**
   * MODIFY these values based on your configuration
   */
  var listClass = 'adoptable-pet-list';
  var tabSelector = '.adoptable-pet-tabs';
  var dataUrl = "//egov.baltimorecountymd.gov/LostAdoptPetService/GetAdoptablePets";
  var templateUrl = "/sebin/l/i/adoptable-pet.template.js";

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

    //Show pets of the tab you selected
    adoptedPets.Show(type);
  }

  $(document).ready(onReady);

  $(document).on('click', tabSelector + ' li a', onTabClick);

})(jQuery, BcList);