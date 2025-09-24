# expo dev-client 모드로 실행하기

- 이 모드로 실행하면 소셜 로그인 시 redirection 같은 게 정상적으로 작동합니당.
- 한번 빌드하면 실시간으로 변경사항이 반영될 수도 있어욥

<br/>

## 0. expo 계정 생성

- expo 페이지 가셔서 계정 생성하시면 됩니당.

<br/>

## 1. `eas.json`에 development 프로필 추가

- 루트에 `eas.json` 생성 후 아래 코드 추가

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## 2. eas 전역 설치

- 터미널에 `npm install -g eas-cli` 실행

<br/>

## 3. eas 빌드 실행 (android, IOS)

- android 앱: `eas build --profile development --platform android`
- IOS 앱: `eas build --profile development --platform ios`
  위 명령어 실행하면 로긘 하라고 뜰텐데 expo 계정, 비번 입력하시면 돼욥

빌드가 완료되면 expo 페이지에 플젝이 알아서 생기는데

플젝 들어가시면 `install`이라고 파란 버튼이 있습니다.

그거 클릭하시면 앱을 내 폰으로 다운 받을 수 있게 됩니당.

<br/>

## 4. 이제 개발할 때 dev client 사용하시면 됩니당

- 내 폰에 받은 어플 들어가시면 QR찍든, url입력하라고 뜨는데
- 코드에디터 터미널에 `npx expo start --dev-client` 입력하시면
- QR 뜹니당 그거 찍으시면 damn 🤘
