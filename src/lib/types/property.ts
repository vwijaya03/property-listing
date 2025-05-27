export type Property = {
  _id: string;
  listingId: number;
  listingIdStr: string;
  title: string;
  address: string;
  description: string;
  price: number;
  rentPrice: number | null;
  lotSize: number;
  buildingSize: number;
  facing: string;
  ownership: string;
  bedroomCount: number;
  bathroomCount: number;
  carCount: number;
  cityId: number;
  cityName: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  electricPower: number | null;
  floorCount: number;
  isMultipleUnits: boolean;
  isVerified: boolean;
  listingForSale: boolean;
  listingForRent: boolean;
  pictureUrls: string[];
  propertyType: string;
  registrant: {
    name: string | null;
    phoneNumberEncrypted: string;
    phoneNumberHash: string;
    delegatePhoneHash: string | null;
    profilePictureURL: string | null;
    company: string | null;
  };
  updatedAt: string;
  createdAt: string;
  withRewardAgreement: boolean;
};

export type City = {
  _id: string;
  cityId: number;
  cityName: string;
};

export type Facing = {
  _id: string;
  title: string;
  value: string;
};

export type LotSize = {
  _id: string;
  title: string;
  value: string;
};

export type PropertyPrice = {
  _id: string;
  title: string;
  value: string;
  numericValue: number;
};

export type Sort = {
  _id?: string;
  title?: string;
  value?: string;
};
