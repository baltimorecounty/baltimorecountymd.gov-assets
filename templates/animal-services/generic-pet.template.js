{{#AllPets}}
    <div id="{{AnimalId}}" class="row pet">
        <div class="col-md-7 col-sm-8">
          {{#if Name}}<h2>{{Name}}</h2>{{/if}}
          <p class="pet-info"><strong class="pet-info-label">Animal ID</strong> <span className="pet-info-value">{{AnimalId}}</span></p>
          <p class="pet-info"><strong class="pet-info-label">Species</strong> <span className="pet-info-value">{{toProperCase Species}}</span></p>
          <p class="pet-info"><strong class="pet-info-label">Breed</strong> <span className="pet-info-value">{{toProperCase Breed}}</span></p>
          <p class="pet-info"><strong class="pet-info-label">Color</strong> <span className="pet-info-value">{{toProperCase Color}}</span></p>
          <p class="pet-info"><strong class="pet-info-label">Sex</strong> <span className="pet-info-value">{{Sex}}</span></p>
          <p class="pet-info"><strong class="pet-info-label">Spayed/Neutered</strong> <span className="pet-info-value">{{#if Altered}}{{Altered}}{{else}}Unknown{{/if}}</span></p>
          <p class="pet-info"><strong class="pet-info-label">Shelter Arrival</strong> <span className="pet-info-value">{{formatShelterArrival ShelterArrival}}</span></p>
          {{#if AboutMe}}<p class="pet-bio"><strong class="pet-bio-label">About Me</strong> <span className="pet-bio-value"></span>{{AboutMe}}</p>{{/if}}
        </div>
        <div class="col-md-5 col-sm-4">
          {{convertImage ImageUrl Species Name Sex 'adoptable'}}
        </div>
  </div>
{{/AllPets}}