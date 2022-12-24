## 웹사이트

https://shareground.vercel.app/

## 소개

ShareGround는 블로그 플랫폼으로서 글을 작성해서 다른 사람과 공유할 수 있습니다.

주요 기능은 다음과 같습니다.

- 파일 업로드 및 다운로드

- 댓글 작성

- 관심 글 추가

- 어떠한 글을 작성했는지 확인

- 글 검색

## 주요 사용 기술 및 사용 이유

### TypeScript

많은 기업들이 TypeScript를 요구하고, 제 개인적으로 컴파일 단계에서 오류를 잡을 수 있다는 점에 대해서 만족하기 때문에 이를 썼습니다.

### React

다른 프레임워크를 배우지 못한 상황이기도 하고, Next.js도 사용하기 위해서 사용했습니다.

### Next.js

서버 사이드 렌더링(SSR)을 구현하기 위해 사용했습니다. article 페이지와 category 페이지에 적용했습니다. 서버 사이드 렌더링을 하는 이유는 검색 엔진 최적화 (SEO) 때문이었습니다. 아무래도 블로그 플랫폼이다 보니 검색에 잡히는 것이 중요하다고 생각했습니다.

### Firebase

가장 유명해서 사용했습니다.

Firebase에서 제공하는 데이터베이스 중 하나인 Firestore를 사용했는데요. 저는 불만족스러웠습니다. 이유는 다음과 같습니다.

- SQL은 컬럼명을 변경할 수 있지만 Firestore는 MongoDB와 유사한 형식이기 때문에 불가능합니다.

- 페이지네이션을 하기 위해서는 기존의 자료들을 다 가져와야 합니다.

- 댓글이나 글에서 작성자의 이름이나 사진을 가지고 오려면 프론트 측에서 또 Firestore에 요청을 해야 했습니다. 만약 SQL이면 join을 하면 되기 때문에 한 번만 요청할 수 있습니다.

### SCSS로 CSS 모듈

처음에는 styled-components를 사용했습니다. 그런데 다음과 같은 에러가 계속 일어났습니다.

```
Warning: Prop `className` did not match. Server: "sc-bqWxrE dFiDCh" Client: "sc-gswNZR jTOsfL"
```

그래서 SCSS로 CSS 모듈을 사용했습니다.

### Redux

인증 정보를 전역 상태로 관리하기 위해 사용했습니다.

Firebase의 currentUser로 사용하면 정보를 가져오는데 시간이 걸리기 때문에 이를 사용했습니다.

Context API를 사용하면 다음과 같은 문제가 생기기 때문에 이를 사용했습니다.

- 다른 reducer(또는 context)가 들어오면 태그 네스팅이 일어납니다.

- 해당 setState나 dispatch(useReducer를 사용한 경우)가 있는 컴포넌트부터 전체가 다 렌더링이 됩니다. 해당 앱의 경우 \_app에서 이를 사용할 것인데, header만 다시 렌더링이 되면 되는데 본문이나 footer도 다시 렌더링이 되면 비효율적입니다.

### Cypress

테스팅으로는 Cypress를 사용했습니다.

Vitest나 Jest와 같은 unit 테스팅 툴은 제가 원하는 테스팅을 하기에는 기능이 부족하다고 생각했습니다.

React Testing Library도 배워 보았지만 복잡하기도 했고, 여전히 화면을 보지 않고 한다는 측면이 답답했습니다.

하지만 Cypress가 만족스럽기만 하지는 않았습니다.

- 브라우저를 실제 돌리다보니 속도가 느렸습니다.

- 같은 코드라고 하더라도 될 때가 있고 안 될 때가 있었습니다. 오류가 났을 때, spec별로 테스트를 할 때는 해당 spec만 다시 돌리면 되기 때문에 시간이 오래 걸리지 않았지만 모든 spec을 한 번에 검사할 때는 시간이 오래 걸렸습니다.

### Mochawesome

Mochawesome을 통해 테스팅에 대한 리포트가 자동으로 작성되게 하였습니다.

Mochawesome을 통해 만들어진 테스트는 해당 페이지에 있습니다.

https://bada3670.github.io/ShareGround/mochawesome/report.html

### Next.js의 API route 및 Mock Service Worker (MSW)

DB를 건드리지 않고 테스팅을 하는 것과 프론트엔드와 백엔드가 동시에 개발하는 경우를 생각하다보니 mocking을 진행했습니다.

두 가지 방법을 썼는데요. 하나는 Next.js의 API route이고요. 다른 하나는 Mock Service Worker (MSW)입니다. 각각의 코드는 m-apiroute 브랜치와 m-msw 브랜치에 있습니다.

안타깝게도 서버 사이드 렌더링 (SSR)에서 클라이언트 사이드가 서버 사이드에 영향을 줄 수 없으므로 전부를 구현하지는 못하고 데이터를 읽는 것을 중심으로 구현을 했습니다.

## 기술적 측면에서의 기능

페이지네이션: 카테고리 페이지에 적용되었습니다.

스크롤을 하면 따라다니기: 맨 위로 가기 버튼에 적용되었습니다.

무한 스크롤: 프로필 페이지의 관심 목록과 작성 목록에 적용되었습니다.

## 겪은 에러와 대처

이에 대해서는 해당 저장소 최상단에 있는 에러.md에 적었습니다.

## 고민했던 부분들

이에 대해서는 해당 저장소 최상단에 있는 고민.md에 적었습니다.
