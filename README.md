# Swagger components
### Package for components based development of openapi 3.0.0 documentation
This package can simplify swagger documentation development with a component-based approach
```
let swagger = require('./index.js')

swagger.init()
swagger.compile()
```
## Installation
Install package
```
npm i swagger-comps
```
I Also recommend you use this [extension](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) for Visual Code
## Quick Start
Init your project directory
```
npm init
```
Install package.
```
npm i swagger-comps
```
Init your project.
```
swagger.init()
```
This function will create base directories for your components

Compile.
```
swagger.compile()
```
