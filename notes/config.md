package.json

"start": "ng serve --ssl --host 0.0.0.0",
"buildx": "ng build --output-path docs --base-href /lyfront-vs/",


angular.json

"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "configurations": {
    "production": {
      "browserTarget": "lyfront-vs:build:production"
    },
    "development": {
      "browserTarget": "lyfront-vs:build:development"
    }
  },
  "defaultConfiguration": "development",
  "options":{
    "sslKey": "../0-commons/ssl/cert.key",
    "sslCert": "../0-commons/ssl/cert.crt"
  }
},
