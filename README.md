<p align="center">
  <a href="https://connect-u.site/" target="blank"><img src=".github/logo_full_dark.svg" width="400" alt="Connect-U Logo" /></a>
</p>

<p align="center">The Frontend of <a href="https://connect-u.site/" target="_blank">Connect-U</a>. Event planning made easy ‒ for private meetups or public events. <br/> Plan, Share, Connect.</p>


<p align="center">
  <a href="https://angular.dev/" target="_blank"><img src="https://img.shields.io/badge/Angular-%23DD0031.svg?logo=angular&logoColor=white"/></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff"/></a>
  <a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff"/></a>
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white"/></a>
  <a href="https://www.npmjs.com/" target="_blank"><img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff"/></a>
  <a href="https://eslint.org/" target="_blank"><img src="https://img.shields.io/badge/eslint-3A33D1?logo=eslint&logoColor=white"/></a>
  <a href="https://capacitorjs.com/" target="_blank"><img src="https://img.shields.io/badge/Capacitor-119EFF?logo=Capacitor&logoColor=white"/></a>
  <a href="https://www.android.com/intl/de_de/phones/" target="_blank"><img src="https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white"/></a>
  <a href="https://developer.apple.com/ios/" target="_blank"><img src="https://img.shields.io/badge/iOS-000000?&logo=apple&logoColor=white"/></a>
  <a href="https://connect-u.site/" target="_blank"><img src="https://img.shields.io/website-up-down-green-red/http/argo.connect-u.site.svg"/></a>
  <a href="https://github.com/VNxyz1/Connect-U-Frontend/pkgs/container/connect-u-frontend" target="_blank"><img src="https://img.shields.io/badge/Docker%20images-2496ED?logo=docker&logoColor=fff"/></a>
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#dependencies">Dependencies</a>
    </li>
    <li>
      <a href="#development-server">Development server</a>
    </li>
    <li>
      <a href="#build">Build</a>
      <ul>
        <li><a href="#app-version">App version</a></li>
        <li><a href="#docker">Docker</a></li>
      </ul>
    </li>
    <li>
      <a href="#linter">Linter</a>
    </li>
    <li>
      <a href="#file-structure">File structure</a>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
  </ol>
</details>



## Dependencies 
- Be sure to have Angular-CLI v18+ installed.
- Run `npm install`

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files, and uses the development environment.

## Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### App version
You can directly open the directory of your desired platform with Android Studio (for android) or Xcode (for ios).
When changes were made to the code, you simply have to run `npm run build:sync-ios` or `npm run build:sync-android`, wait for the process to finish, and restart the project with your IDE (Android Studio or Xcode).


Further reading for the Capacitor workflow: [Capacitor Docs](https://capacitorjs.com/docs/v6/basics/workflow)

### Docker
- Build a docker image of the current application with `docker build -t connect-u-frontend .`.
- Run the docker container with `docker run -d -p 4200:4200 connect-u-frontend`
- It is now accessible on port `4200`

## Linter

```bash
$ npm run lint
```

## File structure
A listing of the relevant files and directories.


```
Connect-U-Frontend
│   README.md
│   transloco.config.ts
│   Dockerfile
│   nginx.conf              # config for docket deployment
│   ...
│
└───android                 # app versions
└───ios
│
└───public
│   └───i18n                # translation files
│   │   │   de-DE.json
│   │   │   en-US.json
│   │   │   ...
│   │
│   └───images              # favicon, app-image, country flags etc.
│
└───src
│   │   index.html
│   │   main.ts
│   │   style.scss
│   │
│   └───assets              # ui-theme
│   │
│   └───environments
│   │   │   environment.ts
│   │   │   environment.app-android.ts
│   │   │   environment.development.ts
│   │
│   └───app
│       │   app.routes.ts   # route configuration
│       │   ...
│       │
│       └───views           # standalone pages which are getting displayed via the router-outlet
│       └───utils           # guards, interceptors, validators and pipes
│       └───services        # services for server and rxjs-subject handling 
│       └───interfaces      # interfaces, primarily used for server comunication
│       └───components      # reusable components
│
└───.github                 # collection of workflow files
    │   workflow.yaml
    │   ...
    
```

## Contributing


<a href="https://github.com/VNxyz1/Connect-U-Frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=VNxyz1/Connect-U-Frontend" alt="contrib.rocks image" />
</a>

## License

Distributed under the MIT License. See `LICENSE.md` for more information.
