# useragentplugin

Posthog useragent plugin.

## Setup via PostHog

1. Find the "plugins" page in PostHog
2. Either select the plugin from the list or copy the URL of this repository to install

## Setup via CLI

1. Install [posthog-cli](https://github.com/PostHog/posthog-cli)
2. Install this plugin: `posthog plugin install useragentplugin`
3. Either use the plugins interface or edit `posthog.json` and add the required config variables:

```json
{
    "name": "useragentplugin",
    "url": "https://github.com/weyert/useragentplugin",
    "global": {
        "enabled": true,
        "config": {
            "bar": "foo"
        }
    }
}
```

4. Run PostHog
