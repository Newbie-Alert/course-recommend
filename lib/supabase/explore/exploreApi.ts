// 검색어 기반 검색
const INCLUDES_TYPE = [
  "hiking_area",
  "park",
  "sports_activity_location",
  "stadium",
  "restaurant",
  "cafe",
  "gym",
  "lodging",
  "hotel",
  "guest_house",
  "campground"
];


const FIELD_MASK = [
  "places.name",
  "places.displayName",
  "places.formattedAddress",
  "places.types",
  "places.location",
  "places.photos",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.regularOpeningHours",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.plusCode",
  "places.reviews"
].join(",");




/**
 * 좌표 기반 주변검색
 * @param lon x 좌표
 * @param lat y 좌표
 */
export const getPlacesByCoords = async (lon: number, lat: number) => {
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby',
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.EXPO_PUBLIC_ANDROID_GOOGLE_PLACES_API_KEY!,
          "X-Goog-FieldMask":FIELD_MASK
        },
        body: JSON.stringify({
          includedTypes: INCLUDES_TYPE,
          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: {
                latitude: lat,
                longitude: lon
              },
              radius: 500.0
            }
          }
        })
      });
    
    const data = await res.json();
    return data.places || []
  } catch (error:any) {
    console.log(JSON.stringify(error.details, null, 2))
  }
  
}

// 검색한 곳 기준의 주변정보
export const getPlacesBySearchText = async (query: string) => {
    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key":
              process.env.EXPO_PUBLIC_ANDROID_GOOGLE_PLACES_API_KEY!,
            "X-Goog-FieldMask": FIELD_MASK,
          },
          body: JSON.stringify({
            textQuery: query,
            languageCode: "ko",
            regionCode: "KR",
          }),
        }
      );

      const data = await res.json();

      //TODO: 나중에 검색어랑 0번째 아이템의 이름이 매칭되지 않을 때 처리를 해야함 (예. 검색 위치와 가장 인접한 장소)

      // 검색 된 아이템 중 첫번째 아이템의 좌표
      const searchedPlaceCoord = data.places[0].location;
      
      const nearByPlaces = await getPlacesByCoords(searchedPlaceCoord.longitude, searchedPlaceCoord.latitude);
      return nearByPlaces

    } catch (error) {
      console.log(error);
    }
};