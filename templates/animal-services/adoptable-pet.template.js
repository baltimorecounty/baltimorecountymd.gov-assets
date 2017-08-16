{{#AllPets}}
    <div id="{{AnimalId}}" class="row pet">
        <div class="col-md-7 col-sm-8">
          {{#if Name}}<h2>{{Name}}</h2>{{/if}}
          <p class="pet-info"><strong class="pet-info-label">Animal ID</strong> {{AnimalId}}</p>
          <p class="pet-info"><strong class="pet-info-label">Species</strong> {{toProperCase Species}}</p>
          <p class="pet-info"><strong class="pet-info-label">Breed</strong> {{toProperCase Breed}}</p>
          <p class="pet-info"><strong class="pet-info-label">Color</strong> {{toProperCase Color}}</p>
          <p class="pet-info"><strong class="pet-info-label">Sex</strong> {{Sex}}</p>
          <p class="pet-info"><strong class="pet-info-label">Spayed/Neutered</strong> {{#if Altered}}{{Altered}}{{else}}Unknown{{/if}}</p>
          <p class="pet-info"><strong class="pet-info-label">Shelter Arrival</strong> {{formatShelterArrival ShelterArrival}}</p>
          {{#if AboutMe}}<p class="pet-bio"><strong class="pet-bio-label">About Me</strong> {{AboutMe}}</p>{{/if}}
        </div>
        <div class="col-md-5 col-sm-4">
          {{convertImage ImageUrl Species Name Sex 'adoptable'}}
        </div>
  </div>
{{/AllPets}}