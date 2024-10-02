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

Visual regression testing compares screenshots of the app against approved 'baseline' screenshots.

The pages or components being screenshotted are specified in `*.story.vue` files using [Histoire.dev](https://histoire.dev/).

The screenshots are taken using [Lost Pixel OSS](https://www.lost-pixel.com/) in docker, ensuring that there are no OS differences in rendering between CI and local tests. These approved 'baseline' screenshots are found in `client/.lostpixel/baseline`.

**how to test (after making your dev changes)**
1. If necessary create or update a `*.story.vue` file with your components. Be sure to include every configuration of your component.
2. `npm run story:build` ...builds the `*.story.vue` files.
3. `npm run test:story` ...tests screenshots of the build (using [Lost Pixel OSS](https://www.lost-pixel.com/)) giving a pass or fail.
    a. If 'pass' then you're done, and you can push your changes.
    b. If 'fail' open the directory `client/.lostpixel/difference` to see a visual diff of the screenshot changes. The filenames imply which `*.story.vue` files were affected. Decide whether to fix the bug or approve the changes. When ready to approve the changes run `npm run test:story:approve`, commit the updated 'baseline' images in `client/.lostpixel/baseline`, and push the changes.
