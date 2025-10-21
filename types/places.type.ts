/** Google Places API: 단일 Place 응답 구조 */
export interface Place {
  formattedAddress: string;
  rating?: number;
  googleMapsUri: string;
  userRatingCount?: number;
  displayName: DisplayName;
  reviews?: Review[];
  photos?: Photo[];
  location: { latitude: number, longitude: number };
}

/** 장소 이름 */
export interface DisplayName {
  text: string;
  languageCode?: string;
}

/** 리뷰 */
export interface Review {
  name: string;
  relativePublishTimeDescription?: string; // "7달 전"
  rating: number;
  text: ReviewText;
  originalText?: ReviewText;
  authorAttribution?: AuthorAttribution;
  publishTime?: string; // ISO datetime string
  flagContentUri?: string;
  googleMapsUri?: string;
}

/** 리뷰 본문 */
export interface ReviewText {
  text: string;
  languageCode?: string;
}

/** 작성자 정보 */
export interface AuthorAttribution {
  displayName?: string;
  uri?: string; // 리뷰 페이지 링크
  photoUri?: string; // 프로필 이미지
}

/** 장소 사진 */
export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: AuthorAttribution[];
  flagContentUri?: string;
  googleMapsUri?: string;
}

/** 예시 전체 구조 */
export interface PlaceResponse {
  places: Place[];
}
