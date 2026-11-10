# cratis.direct

Marketing site for **Cratis Direct** — "coming soon", with a login link to <https://app.cratis.direct>.

Plain static files, no build step (same approach as cratis.no / cratis.studio).

```shell
npm run serve              # http://localhost:4321, opens your browser
PORT=8080 npm run serve    # another port
npm run serve -- --no-open # don't open a browser
```

- `index.html`, `styles.css`, `script.js` — the page
- `assets/img/` — real screenshots captured from the running product (see below)
- Palette and type are taken from the Direct app itself (`Components/Theme/tokens.css` in the Direct repo): navy ground
  `#0f172a`, sky accent `#7ec8f0`, blue primary `#2563eb`, the sky → green headline gradient, Inter.
- The page follows the product's module catalogue (Included / Installed / Available / Preview / Coming). When a module
  changes state in Direct, change it in the **Modules** and **Roadmap** sections here too.

## Refreshing screenshots

Production Direct only trusts identity headers from the in-cluster proxy, so a plain `kubectl port-forward` answers 401.
Use the sanctioned read-only proxy from the Direct repository (it signs you in as the GitHub user `gh` is logged in as):

```shell
# in Cratis/Direct
scripts/production-direct-proxy.sh 15057     # leave running; Ctrl-C removes the pod

# here
npm i --no-save playwright-core
node scripts/capture-screenshots.mjs         # 1440x900, writes assets/img/*.png
```

The proxy must let the browser's observable queries through (`POST /.cratis/queries/sse/subscribe`); a GET-only
proxy leaves every page on its loading skeleton. Skip Operations (pod and namespace names), AI usage (spend) and any
page showing tokens. Review every capture for private repositories (`Cratis/Direct` and `Cratis/Studio` are private)
before committing.
