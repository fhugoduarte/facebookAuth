import React, {Fragment, useCallback, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

import {
  LoginButton,
  GraphRequest,
  GraphRequestManager,
  AccessToken,
} from 'react-native-fbsdk';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const getUserCallback = useCallback((error, result) => {
    setLoading(false);
    if (error) {
      console.log('error', error);
    } else {
      setUser(result);
    }
  }, []);

  const getUserInfo = useCallback(
    token => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          accessToken: token,
          parameters: {
            fields: {string: 'email, name'},
          },
        },
        getUserCallback,
      );

      new GraphRequestManager().addRequest(infoRequest).start();
      setLoading(true);
    },
    [getUserCallback],
  );

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {loading && <ActivityIndicator />}
          {user && (
            <Fragment>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </Fragment>
          )}
        </View>

        <LoginButton
          permissions={['email', 'public_profile']}
          onLoginFinished={async (error, result) => {
            if (error) {
              console.log('error', error);
            } else if (result.isCancelled) {
              console.log('isCancelled');
            } else {
              const {accessToken} = await AccessToken.getCurrentAccessToken();

              getUserInfo(accessToken);
            }
          }}
          onLogoutFinished={() => setUser(null)}
        />
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
});

export default App;
