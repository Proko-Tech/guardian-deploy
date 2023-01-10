const {WebClient} = require('@slack/web-api');

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

/**
 * writes text to a preinstalled cahnnel
 * @param text
 * @return {Promise<*>}
 */
async function write(text, channel) {
  const response = await web.chat.postMessage({channel, text});
  return response;
}

module.exports={write};
