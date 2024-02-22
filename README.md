# templates/spa with Tailwindcss and daisyUI

This template leverages [Remix SPA Mode](https://remix.run/docs/en/main/future/spa-mode) to build your app as a Single-Page Application using [Client Data](https://remix.run/docs/en/main/guides/client-data) for all of you data loads and mutations.

⚠️ This is built on top of the Remix Vite template. Remix support for Vite is unstable and not recommended for production (for REMIX versions prior to v2.7.0)


📖 See the [Remix Vite docs][remix-vite-docs] for details on supported features.

Tailwind and daisyUI has been added to the template.

## Setup

```shellscript
create-remix@latest --debug --template ugmurthy/remix-spa

```

## Development

You can develop your SPA app just like you would a normal Remix app, via:

```shellscript
npm run dev
```

## Production

When you are ready to build a production version of your app, `npm run build` will generate your assets and an `index.html` for the SPA.

```shellscript
npm run build
```

### Preview

You can preview the build locally with [vite preview](https://vitejs.dev/guide/cli#vite-preview) to serve all routes via the single `index.html` file:

```shellscript
npm run preview
```

> ![WARNING] `vite preview` is not designed for use as a production server

### Deployment

You can then serve your app from any HTTP server of your choosing. The server should be configured to serve multiple paths from a single root `/index.html` file (commonly called "SPA fallback"). Other steps may be required if the server doesn't directly support this functionality.

For a simple example, you could use [sirv-cli](https://www.npmjs.com/package/sirv-cli):

```shellscript
npx sirv-cli build/client/ --single
```

[remix-vite-docs]: https://remix.run/docs/en/main/future/vite
