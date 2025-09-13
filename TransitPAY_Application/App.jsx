import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { store } from './src/store';
import { login, loginMock } from './src/slices/userSlice';
import './global.css';
import WalletScreen from './Components/WalletScreen';
import {
  fetchWallet,
  serverTopUp,
  serverDeduct,
} from './src/slices/walletSlice';
import { fetchTrips, createTrip } from './src/slices/tripsSlice';
import {
  HCESession,
  NFCTagType4NDEFContentType,
  NFCTagType4,
} from 'react-native-hce';
import { getOrCreateDeviceId } from './src/utils/deviceId';
import {
  getOrCreateUserId,
  generateUserCard,
  hasGeneratedCard,
} from './src/utils/userId';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const ScreenContainer = ({ title, children }) => (
  <SafeAreaView className="flex-1 bg-white">
    <ScrollView className="p-4 pt-12">
      <Text className="text-3xl pt-3 font-bold mb-4">{title}</Text>
      {children}
    </ScrollView>
  </SafeAreaView>
);

//
// Login
//
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('ada@example.com');
  const [password, setPassword] = React.useState('password123');
  const [error, setError] = React.useState('');

  const onLogin = async () => {
    setError('');
    try {
      await dispatch(login({ email, password })).unwrap();
      navigation.replace('MainTabs');
    } catch {
      setError('Login failed. Using mock account.');
      dispatch(loginMock());
      navigation.replace('MainTabs');
    }
  };

  return (
    <ScreenContainer title="TransitPAY">
      <Text className="mb-2 text-gray-600">Sign in</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        className="border p-3 mb-3"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="border p-3 mb-3"
      />
      {error ? <Text className="text-red-600 mb-2">{error}</Text> : null}
      <TouchableOpacity onPress={onLogin} className="bg-black p-3">
        <Text className="text-white text-center">Sign in</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

//
// Wallet
//

//
// Transactions
//
const TransactionsScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector(s => s.user.token);

  React.useEffect(() => {
    if (token) dispatch(fetchTrips());
  }, [token, dispatch]);

  return (
    <ScreenContainer title="Pay & Ride">
      <TouchableOpacity
        onPress={() =>
          dispatch(createTrip({ route: 'Route A', fareCents: 250 }))
        }
        className="bg-black p-3 mb-2"
      >
        <Text className="text-white text-center">Pay $2.50</Text>
      </TouchableOpacity>
      <Text className="text-gray-600">Configure NFC in Settings.</Text>
    </ScreenContainer>
  );
};

//
// Trips
//
const TripsScreen = () => {
  const trips = useSelector(s => s.trips.recent);
  return (
    <ScreenContainer title="Trips">
      {trips.map(t => (
        <View key={t.id} className="mb-3">
          <Text className="font-bold">{t.route}</Text>
          <Text>
            ${(t.fareCents / 100).toFixed(2)} •{' '}
            {new Date(t.timestamp).toLocaleString()}
          </Text>
          <Text className="text-gray-500">Txn: {t.id}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
};

//
// Profile
//
const ProfileScreen = () => (
  <ScreenContainer title="Profile">
    <Text>Name: Ada Commuter</Text>
    <Text>Email: ada@example.com</Text>
  </ScreenContainer>
);

//
// Settings with UID
//
const SettingsScreen = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [generatedUid, setGeneratedUid] = React.useState(null);
  const userEmail = useSelector(s => s.user.email);

  const onEnableHCE = React.useCallback(async () => {
    const ensuredUserId = (await hasGeneratedCard(userEmail))
      ? await getOrCreateUserId(userEmail)
      : await generateUserCard(userEmail);

    const deviceId = await getOrCreateDeviceId();

    // UID = simple hex hash from user + device
    const uid = Buffer.from(`${ensuredUserId}${deviceId}`)
      .toString('hex')
      .slice(0, 8);

    const tag = new NFCTagType4({
      type: NFCTagType4NDEFContentType.Text,
      content: `UID:${uid}`,
      writable: false,
    });

    const session = await HCESession.getInstance();
    await session.setApplication(tag);
    await session.setEnabled(true);

    setEnabled(true);
    setGeneratedUid(uid);
  }, [userEmail]);

  const onDisableHCE = React.useCallback(async () => {
    const session = await HCESession.getInstance();
    await session.setEnabled(false);
    setEnabled(false);
  }, []);

  return (
    <ScreenContainer title="Settings">
      {!enabled ? (
        <TouchableOpacity onPress={onEnableHCE} className="bg-green-600 p-3">
          <Text className="text-white text-center">Enable NFC HCE</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onDisableHCE} className="bg-red-600 p-3">
          <Text className="text-white text-center">Disable NFC HCE</Text>
        </TouchableOpacity>
      )}
      {generatedUid && (
        <Text className="mt-3 text-gray-700">UID: {generatedUid}</Text>
      )}
    </ScreenContainer>
  );
};

//
// Tabs
//
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const map = {
          Transactions: 'credit-card-scan',
          Wallet: 'wallet',
          Trips: 'history',
          Profile: 'account-circle',
          Settings: 'cog',
        };
        return (
          <Icon name={map[route.name] || 'circle'} size={size} color={color} />
        );
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: 'white' },
    })}
  >
    <Tab.Screen name="Transactions" component={TransactionsScreen} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Trips" component={TripsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

//
// Root
//
const Root = () => {
  const isAuthed = useSelector(s => s.user.isAuthenticated);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthed ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
