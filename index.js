const {
  env: {
    // Your Dareboost API token
    // https://www.dareboost.com/en/profile/api
    DAREBOOST_API_TOKEN,
    // The commit message
    COMMIT_REF,
  },
} = require('process');

const fetch = require('node-fetch');

module.exports = {
  async onSuccess({
    utils: {
      build: { failPlugin },
    },
    inputs: { monitoringIds, scenarioIds },
  }) {
    console.log('Dareboost: initiate event creation');

    if (DAREBOOST_API_TOKEN && DAREBOOST_API_TOKEN.length == 0)
      return failPlugin(
        'Dareboost: please define your DAREBOOST_API_TOKEN as en environment variable.',
        {
          error,
        }
      );

    try {
      let postBody = {
        token: DAREBOOST_API_TOKEN,
        key: `build-${COMMIT_REF.slice(0, 8)}`,
        text: `Netlify build from commit ${COMMIT_REF}`,
        date: new Date().toISOString(),
      };

      if (monitoringIds.length > 0) {
        postBody.monitorings = monitoringIds
          .split(',')
          .map((x) => parseInt(x, 10));
      }
      if (scenarioIds.length > 0) {
        postBody.scenarios = scenarioIds.split(',').map((x) => parseInt(x, 10));
      }

      const { status, statusText } = await fetch(
        'https://www.dareboost.com/api/0.6/event/create',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(postBody),
        }
      );

      if (status != 200) {
        return failPlugin('Dareboost: event not created. Error: ' + statusText);
      } else {
        console.log('Dareboost: event created');
      }
    } catch (error) {
      return failPlugin('Dareboost: error during event creation.', { error });
    }
  },
};
