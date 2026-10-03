# Explore before NASA Eyes layout alignment

`explore-native.zip` preserves the native edition immediately before the October 4, 2026 visual revision. It contains these files, originally in `src/components/explore/`:

- `NativeExplorer.tsx`
- `ExplorerScene.tsx`
- `SpacecraftModel.tsx`
- `explore.module.css`

The active edition now uses `explorer-console.module.css`; the previous stylesheet remains in the source tree. No protected folders are part of this backup or revision.

The current Explore page supplies its own shared `Navigation` instance. To restore the previous header arrangement with this ZIP, also remove `/explore` from the early-return condition in `src/components/layout/SiteChrome.tsx`. The optional explorer slots added to `Navigation.tsx` are backward compatible with the original `<Navbar />` usage.
