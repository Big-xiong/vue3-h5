export function loadPTGame(res, lang) {
  const { username, password, mode, code, client, js } = res
  let script = document.createElement('script')
  script.setAttribute('src', js)
  document.head.appendChild(script)
  // Set up callback after JS file is loaded
  script.onload = () => {
    window.iapiSetCallout('Login', (response) => {
      if (response.errorCode) {
        // Login failed
        if (response.errorCode === 48) {
          alert('Login failed, error: ' + response.errorCode + ' playerMessage: ' + response.actions.PlayerActionShowMessage[0].message);
        } else {
          alert('Login failed, error: ' + response.errorCode + ' playerMessage: ' + response.playerMessage)
        }
      } else {
        // Login success
        launchGame({ client, mode, code, lang });
      }
    })

    if (mode.toLowerCase() == 'real') {
      window.iapiSetClientType('casino');
      window.iapiSetClientPlatform('web');
      window.iapiLogin(username.toUpperCase(), password, 1, lang);
    } else {
      if (client == 'ngm_desktop' || client == 'ngm_mobile') {
        iapiSetClientParams(client, 'language=' + lang + '&real=0');
        iapiLaunchClient(client, code, mode, '_self');
      }
    }

  }
}

function launchGame({ client, mode, code, lang }) {
  // Get variables
  let real = (mode.toLowerCase() == 'real') ? 1 : 0;
  // Optional Variables
  let lobbyUrl = '';
  let logoutUrl = '';
  let supportUrl = '';
  let depositUrl = '';

  // Slots,Table Games and other non-live games
  if (client == 'ngm_desktop' || client == 'ngm_mobile') {
    iapiSetClientParams(client, 'language=' + lang + '&real=' + real + '&lobby=' + lobbyUrl + '&logout=' + logoutUrl + '&deposit=' + depositUrl + '&support=' + supportUrl + '&backurl=' + lobbyUrl);
    iapiLaunchClient(client, code, mode, '_self');
  }

  // Live Games
  if (client == 'live_desk' || client == 'live_mob') {
    iapiSetClientParams(client, '&launch_alias=' + code + '&language=' + lang + '&real=' + real + '&lobby=' + lobbyUrl + '&logout=' + logoutUrl + '&deposit=' + depositUrl + '&support=' + supportUrl);
    iapiLaunchClient(client, null, mode, '_self');
  }
}

