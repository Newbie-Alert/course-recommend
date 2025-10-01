import { useAuthContext } from "@/hooks/useAuthContext";
import { getAddressFromCoords } from "@/lib/getAddress";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { createContext, useContext, useEffect, useState } from "react";

type FeedInitContext = {
  userId: string | undefined;
  location: Location.LocationObject | null;
  address: Location.LocationGeocodedAddress | null | undefined;
};

const FeedInitContext = createContext<FeedInitContext>({
  userId: "",
  location: null,
  address: null,
});

export default function FeedInitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isFocused = useIsFocused();

  const { session } = useAuthContext();
  const userId = session?.user.id;

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMeg, setErrorMeg] = useState<string | null>(null);
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>();

  useEffect(() => {
    if (!isFocused) return;

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMeg("위치 정보 접근이 거부되었습니다. 권한을 허용해주세요.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, [isFocused]);

  useEffect(() => {
    const returnAddress = async () => {
      const address = await getAddressFromCoords(location);
      if (address) {
        setAddress(address);
      }
    };

    if (location) {
      returnAddress();
    }
  }, [location]);

  return (
    <FeedInitContext.Provider value={{ userId, location, address }}>
      {children}
    </FeedInitContext.Provider>
  );
}

export const useFeedInitContext = () => useContext(FeedInitContext);
