# Vendored libraries

These files are served as is, with no build step. When you update one, replace the file with the matching file from the official npm package and update its row below.

| File | Library | Version | Upstream npm path | Bytes | sha256 |
|---|---|---|---|---|---|
| `gsap.min.js` | GSAP | 3.15.0 | `gsap@3.15.0/dist/gsap.min.js` | 72927 | `92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb` |
| `ScrollTrigger.min.js` | GSAP ScrollTrigger | 3.15.0 | `gsap@3.15.0/dist/ScrollTrigger.min.js` | 44575 | `b0b14d67b55b0c43c756ac0b106cfcb09d0879945f6ead64451065b0672916a2` |
| `lenis.min.js` | Lenis | 1.3.26 | `lenis@1.3.26/dist/lenis.min.js` | 18685 | `306f7b6d19642f617aa4e8fb67bc9d3cae17bd0c34e52b852e476dc11657da4c` |

The hashes were recorded from the committed files. They have not yet been compared with the npm packages.

To check a file:

```bash
sha256sum vendor/*.js
```
