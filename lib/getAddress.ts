import * as Location from "expo-location";

type Props = Location.LocationObject | null

export async function getAddressFromCoords(location : Props) {
  if (!location) return null

  const { latitude, longitude } = location.coords;

  const addresses = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (addresses.length > 0) {
    const addr = addresses[0];
    /*
    {
      city: "Seoul",
      district: "Gangnam-gu",
      region: "Seoul",
      street: "Teheran-ro",
      name: "123",
      postalCode: "06236",
      country: "South Korea",
      isoCountryCode: "KR"
    }
  */
    return addr;
  }
}
