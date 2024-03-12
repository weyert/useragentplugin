# User Agent Plugin

Enhances events to include the browser details when the event has a property `$useragent`
which allows off loading retrieving/parsing user agent strings at event ingest.

It's used to easily pass the `User-Agent` HTTP header from incoming requests and let
this plugin handle parsing it.

## Installation

1. Visit 'Project Plugins' under 'Settings'
1. Enable plugins if you haven't already done so
1. Click the 'Available' tab next to 'Installed'
1. Click 'Install' on this plugin

## Updating

### Automagically

Husky is used to add the latest version of the built artefact whenever you commit.

### Manually

Run the build step locally and commit the artifact to the repo so that it can be used directly in PostHog:

```
    npm i && npm run build && git add -f dist/
```
