# Page-Specific Javascript
This folder contains Javascript files used on specific pages on the Baltimore County Governement Website.

## Spay & Neuter Calculator
This script runs the Spay & Neuter calculator, and must be included on the page in a HTML Snippet **after** the closing `</form>` tag.

### Sample Code

```
<form id="spayNeuterForm">
    <h3>Determine if your pet is eligible.</h3>
    <p>Are you a Baltimore County resident?<span class="required">*</span></p>
    <div class="radio">
        <label class="radio-inline">
            <input type="radio" id="isBaltimoreCountyResident1" name="isBaltimoreCountyResident" value="true" data-validation-message="Please select Yes or No." /> Yes
        </label>
        <label class="radio-inline">
            <input type="radio" id="isBaltimoreCountyResident2" name="isBaltimoreCountyResident" value="false" data-validation-message="Please select Yes or No." /> No
        </label>
    </div>
    <p>Are you on public assistance?<span class="required">*</span></p>
    <div class="radio">
        <label class="radio-inline">
            <input type="radio" id="isPublicAssistance1" name="isPublicAssistance" value="true" data-validation-message="Please select Yes or No." /> Yes
        </label>
        <label class="radio-inline">
            <input type="radio" id="isPublicAssistance2" name="isPublicAssistance" value="false" data-validation-message="Please select Yes or No." /> No
        </label>
    </div>
    <p>Is your pet either a cat or pit bull?<span class="required">*</span></p>
    <div class="radio">
        <label class="radio-inline">
            <input type="radio" id="isCatPitBull1" name="isCatPitBull" value="true" data-validation-message="Please select Yes or No." /> Yes
        </label>
        <label class="radio-inline">
            <input type="radio" id="isCatPitBull2" name="isCatPitBull" value="false" data-validation-message="Please select Yes or No." /> No
        </label>
    </div>
    <div class="row">
        <div class="form-group col-md-4">
            <p>What is your ZIP code?<span class="required">*</span> </p>
            <input type="text" class="form-control" id="zipCode" placeholder="21204" aria-label="What is your ZIP code?" data-validation-message="Please enter your 5-digit ZIP code." />
        </div>
    </div>
    <button type="button" id="spayNeuterFormButton" class="contentButton">CALCULATE</button>	
    <div id="spayNeuterFormResults" class="hidden"></div>
</form>

<script src="/path/to/spay-neuter-calculator.min.js"></script>
```

**filename**: spay-neuter-calculator.js  
**unit tests**: spay-neuter-calculator.spec.js  
**page**: [Animal Services Spay & Neuter page](http://dev.baltimorecountymd.gov/Agencies/health/animalservices/spayneuter.html)  
### Dependencies
* [jQuery](https://jquery.com/)
* Form Validator library in the */js/utilities* folder. This is a part of inside-template.min.js.