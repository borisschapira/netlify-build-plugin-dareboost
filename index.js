const {
  env: {
    // Your Dareboost API token
    // https://www.dareboost.com/en/profile/api
    DAREBOOST_API_TOKEN,
    // The commit message
    COMMIT_REF,
  },
} = require("process");

const fetch = require("node-fetch");

const callAPI = async function (route, postData, token) {
  console.log(
    `Dareboost: calling route "${route}". Data: ${JSON.stringify(
      Object.assign({ token: "****************" }, postData)
    )}`
  );

  try {
    const { status, statusText } = await fetch(
      `https://www.dareboost.com/api/0.6${route}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(Object.assign({ token: token }, postData)),
      }
    );

    if (status != 200) {
      return failPlugin(
        `Dareboost: error while calling the route "${route}". Error: ${statusText}`
      );
    } else {
      console.log(`Dareboost: calling route "${route}" => Success`);
    }
  } catch (error) {
    return failPlugin(
      `Dareboost: error while calling the route "${route}". Error:`,
      { error }
    );
  }
};

module.exports = {
  async onSuccess({
    utils: {
      build: { failPlugin },
    },
    inputs: { monitoringIds, scenarioIds, configurations },
  }) {
    if (DAREBOOST_API_TOKEN && DAREBOOST_API_TOKEN.length == 0)
      return failPlugin(
        "Dareboost: please define your DAREBOOST_API_TOKEN as en environment variable.",
        {
          error,
        }
      );

    let postBody = {
      token: DAREBOOST_API_TOKEN,
      key: `build-${COMMIT_REF.slice(0, 8)}`,
      text: `Netlify build from commit ${COMMIT_REF}`,
      date: new Date().toISOString(),
    };

    if (monitoringIds.length > 0) {
      postBody.monitorings = monitoringIds
        .split(",")
        .map((x) => parseInt(x, 10));
    }
    if (scenarioIds.length > 0) {
      postBody.scenarios = scenarioIds.split(",").map((x) => parseInt(x, 10));
    }

    await callAPI("/event/create", postBody, DAREBOOST_API_TOKEN);

    if (configurations.length) {
      for (let index = 0; index < configurations.length; index++) {
        await callAPI(
          "/analysis/launch",
          configurations[index],
          DAREBOOST_API_TOKEN
        );
      }
    }
  },
};
