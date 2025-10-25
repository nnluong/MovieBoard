/**
 * MovieBoard App
 * Tab Navigation Implementation with Redux
 *
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store';
import TabNavigator from './src/navigation/TabNavigator';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <TabNavigator />
    </Provider>
  );
}

export default App;
