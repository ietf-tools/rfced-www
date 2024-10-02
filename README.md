<div align="center">
  
<img src="https://raw.githubusercontent.com/ietf-tools/common/main/assets/logos/rfced-www.svg" alt="RFC" height="125" />

[![Release](https://img.shields.io/github/release/ietf-tools/rfced-www.svg?style=flat&maxAge=300)](https://github.com/ietf-tools/rfced-www/releases)
[![License](https://img.shields.io/github/license/ietf-tools/rfced-www)](https://github.com/ietf-tools/rfced-www/blob/main/LICENSE)
![Node Version](https://img.shields.io/badge/node.js-20-green?logo=node.js&logoColor=white)
![Nuxt Version](https://img.shields.io/badge/nuxt-3-green?logo=nuxt.js&logoColor=white)
![Vue Version](https://img.shields.io/badge/vue-3-green?logo=vue.js&logoColor=white)

##### Website for the RFC Editor

</div>

# Development

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) *(Windows only)*

## Getting Started

### Client

See `/client/` 

*TODO*

## Testing

### Visual regression testing

To update baselines locally run `npm run story:test:update` to update, this will ensure that lost-pixel runs in docker and there are no OS differences in rendering between CI and local tests.