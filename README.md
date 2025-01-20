# ConnectUFrontend

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files, and uses the development environment.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### App version
Run `npm run build-app` to build the project with the app environment. Then run `npx cap add [ android | ios ]` to add your platform of choice.
You now have to oben the generated directory with Android Studio (for android) or Xcode (for ios).

### Docker
- Build a docker image of the current application with `docker build -t connect-u-frontend .`.
- Run the docker container with `docker run -d -p 4200:4200 connect-u-frontend`
- It is now accessible on port `4200`


## File structure

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
│   │   │   environment.app.ts
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
