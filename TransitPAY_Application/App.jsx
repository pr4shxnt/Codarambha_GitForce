import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store';
import { login, loginMock } from './src/slices/userSlice';
import { fetchWallet, serverTopUp, serverDeduct, topUp, deduct } from './src/slices/walletSlice';
import { addTrip, fetchTrips, createTrip } from './src/slices/tripsSlice';
import { Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { HCESession, NFCTagType4NDEFContentType, NFCTagType4 } from 'react-native-hce';
import { getOrCreateDeviceId } from './src/utils/deviceId';
import { getOrCreateUserId, hasGeneratedCard, generateUserCard } from './src/utils/userId';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ScreenContainer = ({ title, children }) => (
  <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#f9fafb', minHeight: '100%' }}>
    <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 12, color: '#111827' }}>{title}</Text>
    {children}
  </ScrollView>
);

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('ada@example.com');
  const [password, setPassword] = React.useState('password123');
  const [error, setError] = React.useState('');
  const onLogin = async () => {
    setError('');
    try {
      await dispatch(login({ email, password })).unwrap();
      navigation.replace('Main');
    } catch (e) {
      setError('Login failed. Using mock account.');
      dispatch(loginMock());
      navigation.replace('Main');
    }
  };
  return (
    <ScreenContainer title="Welcome to TransitPAY">
      <Text style={{ color: '#6b7280', marginBottom: 16 }}>Sign in to continue</Text>
      <View style={{ gap: 12 }}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 10 }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 10 }}
        />
        {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
        <TouchableOpacity onPress={onLogin} style={{ backgroundColor: '#111827', padding: 14, borderRadius: 10 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const WalletScreen = () => {
  const balanceCents = useSelector(s => s.wallet.balanceCents);
  const token = useSelector(s => s.user.token);
  const dispatch = useDispatch();
  React.useEffect(() => { if (token) { dispatch(fetchWallet()); } }, [token, dispatch]);
  return (
    <ScreenContainer title="Wallet">
      <View style={{ backgroundColor: '#111827', padding: 20, borderRadius: 16 }}>
        <Text style={{ color: '#9ca3af' }}>Current balance</Text>
        <Text style={{ color: 'white', fontSize: 32, fontWeight: '800' }}>${(balanceCents / 100).toFixed(2)}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <TouchableOpacity onPress={() => dispatch(serverTopUp(1000))} style={{ backgroundColor: '#059669', padding: 12, borderRadius: 10, flex: 1 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Top up $10</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(serverDeduct(250))} style={{ backgroundColor: '#b91c1c', padding: 12, borderRadius: 10, flex: 1 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Deduct $2.50</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const TransactionsScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector(s => s.user.token);
  const balanceCents = useSelector(s => s.wallet.balanceCents);
  const lowBalance = useSelector(s => balanceCents <= s.alerts.lowBalanceThresholdCents);
  React.useEffect(() => { if (token) { dispatch(fetchTrips()); } }, [token, dispatch]);
  return (
    <ScreenContainer title="Pay & Ride">
      <Text style={{ color: '#6b7280' }}>Tap below to simulate a ride payment.</Text>
      <View style={{ height: 8 }} />
      <TouchableOpacity onPress={() => dispatch(createTrip({ route: 'Route A', fareCents: 250 }))} style={{ backgroundColor: '#111827', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Pay $2.50</Text>
      </TouchableOpacity>
      <View style={{ height: 12 }} />
      <Text>Configure NFC in Settings.</Text>
      {lowBalance ? (
        <Text style={{ color: '#b91c1c' }}>Low balance. Please top up.</Text>
      ) : (
        <Text style={{ color: '#059669' }}>Balance OK.</Text>
      )}
    </ScreenContainer>
  );
};

const TripsScreen = () => {
  const trips = useSelector(s => s.trips.recent);
  return (
    <ScreenContainer title="Trips">
      {trips.map(t => (
        <View key={t.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontWeight: '700', color: '#111827' }}>{t.route}</Text>
          <Text style={{ color: '#374151' }}>${(t.fareCents / 100).toFixed(2)} • {new Date(t.timestamp).toLocaleString()}</Text>
          <Text selectable style={{ color: '#6b7280' }}>Txn: {t.id}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
};

const AlertsScreen = () => {
  const balanceCents = useSelector(s => s.wallet.balanceCents);
  const threshold = useSelector(s => s.alerts.lowBalanceThresholdCents);
  const low = balanceCents <= threshold;
  return (
    <ScreenContainer title="Alerts">
      <Text>Low balance threshold: ${(threshold / 100).toFixed(2)}</Text>
      <Text style={{ marginTop: 8 }}>Current balance: ${(balanceCents / 100).toFixed(2)}</Text>
      <Text style={{ marginTop: 8, color: low ? '#b91c1c' : '#059669' }}>{low ? 'Alert: Low balance' : 'All good'}</Text>
    </ScreenContainer>
  );
};

const LoadWalletScreen = () => (
  <ScreenContainer title="Load Wallet">
    <Text>Static top-up options (Visa/Mastercard, Mobile Money, Cash agent).</Text>
  </ScreenContainer>
);

const ProfileScreen = () => (
  <ScreenContainer title="Profile">
    <Text>Name: Ada Commuter</Text>
    <Text>Email: ada@example.com</Text>
  </ScreenContainer>
);

const SettingsScreen = () => {
  const [enabled, setEnabled] = React.useState(false);
  const userEmail = useSelector(s => s.user.email);
  const [cardReady, setCardReady] = React.useState(false);
  const [lastRead, setLastRead] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      setCardReady(await hasGeneratedCard(userEmail || 'anonymous'));
    })();
  }, [userEmail]);

  const onEnableHCE = React.useCallback(async () => {
    const ensuredUserId = cardReady ? await getOrCreateUserId(userEmail || 'anonymous') : await generateUserCard(userEmail || 'anonymous');
    const [deviceId, userId] = await Promise.all([
      getOrCreateDeviceId(),
      Promise.resolve(ensuredUserId),
    ]);
    const tag = new NFCTagType4({
      type: NFCTagType4NDEFContentType.Text,
      content: `TransitPay | user:${userId} | device:${deviceId}`,
      writable: false,
    });
    const session = await HCESession.getInstance();
    await session.setApplication(tag);
    await session.setEnabled(true);
    setEnabled(true);
    setCardReady(true);
  }, [userEmail, cardReady]);

  const onDisableHCE = React.useCallback(async () => {
    const session = await HCESession.getInstance();
    await session.setEnabled(false);
    setEnabled(false);
  }, []);

  React.useEffect(() => {
    let remove;
    (async () => {
      const session = await HCESession.getInstance();
      remove = session.on(HCESession.Events.HCE_STATE_READ, () => {
        setLastRead(new Date().toLocaleString());
      });
    })();
    return () => { if (remove) remove(); };
  }, []);

  return (
    <ScreenContainer title="Settings">
      <Text style={{ marginBottom: 8 }}>Notifications, Security, About.</Text>
      <View style={{ height: 8 }} />
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>NFC</Text>
      {!cardReady && (
        <Text style={{ marginBottom: 8 }}>No NFC card yet. Tap Enable to generate.</Text>
      )}
      {!enabled ? (
        <TouchableOpacity onPress={onEnableHCE} style={{ backgroundColor: '#059669', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Enable NFC HCE</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onDisableHCE} style={{ backgroundColor: '#b91c1c', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Disable NFC HCE</Text>
        </TouchableOpacity>
      )}
      {lastRead && (
        <Text style={{ marginTop: 8 }}>Last reader access: {lastRead}</Text>
      )}
    </ScreenContainer>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const map = {
          Transactions: 'credit-card-scan',
          Wallet: 'wallet',
          'Load Wallet': 'wallet-plus',
          Profile: 'account-circle',
          Settings: 'cog',
        };
        const name = map[route.name] || 'circle';
        return <Icon name={name} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#111827',
      tabBarInactiveTintColor: '#9ca3af',
    })}
  >
    <Tab.Screen name="Transactions" component={TransactionsScreen} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Load Wallet" component={LoadWalletScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const Root = () => {
  const isAuthed = useSelector(s => s.user.isAuthenticated);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthed ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}


