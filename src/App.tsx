import {useEffect, useState} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';

import {Layout} from 'antd';
import {Content} from 'antd/lib/layout/layout';

import {config} from '@constants/config';

import {Modal} from '@atoms';

import {Main} from '@pages';

import {
  FinalizedApiEndpoint,
  checkIfQueryParamsExistsInUrl,
  getApiEndpointOnPageLoad,
  isHostProtocolSecure,
  showSmallError,
} from '@utils';

// import Colors from '@styles/Colors';

// import {Sidebar} from './components/organisms';

declare global {
  interface Window {
    _env_: any;
  }
}

const RootLayoutStyles = {
  height: '100vh',
};

const RootContentStyles = {
  height: 'inherit',
  // backgroundColor: Colors.blackPearl,
  paddingLeft: 125,
  paddingRight: 25,
};

const App = () => {
  const history = useHistory();

  const [visible, setVisible] = useState<boolean>(false);

  const dashboardEndpointValidators = () => {
    if (!isHostProtocolSecure()) {
      showSmallError(`Dashboard is using non-secure protocol!
      <a href='https://kubeshop.github.io/testkube/dashboard/#httpstls-configuration' target="_blank" rel="noopener">Read more</a>`);
    }

    const dashboardEnvVariable = window?._env_?.REACT_APP_API_SERVER_ENDPOINT;

    if (dashboardEnvVariable && dashboardEnvVariable !== 'default') {
      setVisible(false);
      FinalizedApiEndpoint(dashboardEnvVariable, true);
      history.push({
        pathname: '/',
        search: `?${new URLSearchParams({apiEndpoint: `${dashboardEnvVariable}`}).toString()}`,
      });
    }

    if (dashboardEnvVariable === 'default') {
      setVisible(true);
    }

    const apiEndpointExist = checkIfQueryParamsExistsInUrl(config.apiEndpoint);

    if (apiEndpointExist) {
      getApiEndpointOnPageLoad();
      setVisible(false);
    }
  };

  useEffect(() => {
    dashboardEndpointValidators();
  }, []);

  return (
    <>
      {visible && <Modal visible isModalVisible={setVisible} />}
      <Layout style={RootLayoutStyles}>
        {/* <Sidebar /> */}
        <Layout style={RootContentStyles}>
          <Content>
            <div className="site-layout-background">
              <Switch>
                <Route path="/?apiEndpoint=:apiEndpoint" exact render={Main} />
                <Route path="/" exact component={Main} />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
