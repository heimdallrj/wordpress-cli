var log = {};

log['init'] = `
WordPress CLI <cliVersion>

Initializing a new WordPress project in <docRoot>/`;

log['alreadyExists'] = 'You already have a WordPress project in here..';
log['notInWorkingDir'] = 'You are not in the working directory..';
log['promptForUserInputs'] = `Prompt for configuration details:\r\n`;
log['initializing'] = '\r\n✔  Initializing...';
log['createDbSuccess'] = '✔  Database creation..';
log['createDbFail'] = '✖  Database creation..';
log['fetchWPLatestSuccess'] = '✔  Fetching WordPress latest release..';
log['fetchWPLatestFail'] = '✖  Fetching WordPress latest release..';
log['ready'] = '✔  Ready for development..';

log['success'] = `
Success! Created \`<siteName>\` at <docRoot>
Inside that directory, you can run several \`wp\` commands:

To start the server:

  <cdSiteSir>
  wp serve
`;

log['updated'] = `<configJson>

'✔  Saved.';
`;

module.exports = log;
