export class Country {
  country: string;
  countryId: number;
  specificInfo: string;
  createdBy: number;
}
export class State {
  StateName: string;
  StateId: number;
  StateCode: string;
  CountryId: number;
  countryName: string;
  createdBy: number;
}
export class District {
  districtId: number;
  districtName: string;
  StateId: number;
}
export class City {
  cityName: string;
  cityId: number;
  cityCode: string;
  districtId: number;
}

