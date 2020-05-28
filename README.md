# Dareboost Netlify Build Plugin

**You need [a Dareboost plan](https://www.dareboost.com/en/offers) to enjoy this plugin**

This plugin use the [Dareboost API](https://www.dareboost.com/en/documentation-api) to react to a successful build.

**If your plan contains monitoring**: adds a Dareboost event on the page and/or User Journey monitors you have defined

**If your plan contains API credits**: launches analysis you have configured in your `netlify.toml` file.

## Minimal usage (global event)

1. Install the plugin:

   ```
   npm i netlify-build-plugin-dareboost
   ```

2. Add the plugin declaration to your netlify.toml configuration file.

   ```
   [[plugins]]
   package = "netlify-build-plugin-dareboost"
   ```

3. Get your Dareboost API authentication token and save it in an environment variable called DAREBOOST_API_TOKEN (under **Settings > Build & deploy > Environment > Environment variables**). Please read [Netlify's documentation about environment variables](https://docs.netlify.com/configure-builds/environment-variables/). Your API token must be kept **private**.

## \[Optional\] Create an event specific to certain monitors

If you want your Dareboost event to be related to specific monitors, you can add some configuration using the Netlify Plugins inputs:

- `monitoringIds`: The ids of the page monitors relevant to the build, separated by a coma.
- `scenarioIds`: The ids of the User Journey monitors relevant to the build, separated by a coma.

Example:

```
[[plugins]]
package = "netlify-build-plugin-dareboost"

  [plugins.inputs]
  monitoringIds = "7134"
  scenarioIds = "121, 122"
```

If neither `monitoringIds` nor `scenarioIds` are defined, the event will be considered global.

## \[Optional\] Launch analyses if the build is successful

If you want the plugin to automatically launch analyses when the build is successful, you can define multiple analyses configurations.

**Beware**: the analyses will be launched simultaneously. Make sure that your subscription supports this, otherwise just define one configuration.

Example (will consume 2 API credits):

```
[[plugins]]
package = "netlify-build-plugin-dareboost"

  [plugins.inputs]

    [[plugins.inputs.configurations]]
    url = "https://boris.schapira.dev"
    lang = "en"
    location = "San Jose"
    isPrivate = "true"
    visualMetrics = "true"

      [plugins.inputs.configurations.browser]
      name = "Chrome"
```

Find more information on the multiple parameters and the API quotas in the [Dareboost API documentation](https://www.dareboost.com/en/documentation-api) (route "/analysis/launch").