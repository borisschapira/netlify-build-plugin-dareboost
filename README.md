# Dareboost Netlify Build Plugin

When a build is successful, adds a Dareboost event on the page and/or User Journey monitors you have defined, using the [Dareboost API](https://www.dareboost.com/en/documentation-api).

## How to use?

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

### \[Optional\] Specify monitors

If you want your Dareboost event to be specifically related to specific monitors, you can add some configuration using the Netlify Plugins inputs:

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
