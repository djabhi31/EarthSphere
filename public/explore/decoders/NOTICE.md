# Model decoder dependencies

These browser decoder files are copied from the installed Three.js 0.184 distribution, `examples/jsm/libs/`. They support the Draco mesh compression and Basis/KTX2 texture compression used by public NASA/JPL spacecraft models.

- Draco: Google, Apache License 2.0; see `draco/LICENSE` and `draco/README.md`.
- Basis Universal: Binomial LLC, Apache License 2.0; see `basis/LICENSE` and `basis/README.md`.

Decoder JavaScript and WebAssembly are served locally. NASA models and their textures are fetched on selection from NASA's public asset host, rather than loading every model at startup.
