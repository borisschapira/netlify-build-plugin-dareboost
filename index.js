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
    const fetchResult = await fetch(
      `https://www.dareboost.com/api/0.6${route}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(Object.assign({ token: token }, postData)),
      }
    );
    const fetchData = await fetchResult.json();

    const { status, statusText } = fetchResult;

    if (status != 200) {
      return failPlugin(
        `Dareboost: error while calling the route "${route}". Error: ${statusText}`
      );
    }

    console.log(`Dareboost: calling route "${route}" => Success`);
    return fetchData;
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
      status: { show },
    },
    inputs: { monitoringIds, scenarioIds, configurations },
  }) {
    // Token validation
    if (!DAREBOOST_API_TOKEN) {
      return failPlugin(
        [
          "A Dareboost subscription is required to use this plugin.",
          "If you do have a plan, please define your DAREBOOST_API_TOKEN as en environment variable.",
          "- get your token at https://www.dareboost.com/en/profile/api",
          "- define the variable in Netlify https://docs.netlify.com/configure-builds/environment-variables/#declare-variables",
        ].join("\n")
      );
    }

    let postBody = {
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

    let showMessage = {
      title: "Dareboost Build Plugin",
      summary: "Monitoring event created.",
      text: "",
    };

    if (configurations.length) {
      for (let index = 0; index < configurations.length; index++) {
        const { reportId } = await callAPI(
          "/analysis/launch",
          configurations[index],
          DAREBOOST_API_TOKEN
        );

        if (index == 0) {
          showMessage.summary += " Analyses launched:";
        } else {
          showMessage.text += "\n";
        }
        showMessage.text += ` - for ${configurations[index].url}`;
        if (configurations[index].browser && configurations[index].browser.name)
          showMessage.text += ` (${configurations[index].browser.name})`;
        showMessage.text += `\n   report URL: https://www.dareboost.com/en/loading/audit?reportIds=${reportId}`;
      }
    }

    show(showMessage);
  },
};
