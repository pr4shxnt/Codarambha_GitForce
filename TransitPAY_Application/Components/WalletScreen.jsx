import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ScreenContainer } from '../App';
import {
  fetchWallet,
  serverDeduct,
  serverTopUp,
} from '../src/slices/walletSlice';
import { fetchTrips } from '../src/slices/tripsSlice';

const WalletScreen = () => {
  const balanceCents = useSelector(s => s.wallet.balanceCents);
  const trips = useSelector(s => s.trips.recent);
  const token = useSelector(s => s.user.token);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (token) {
      dispatch(fetchWallet());
      dispatch(fetchTrips());
    }
  }, [token, dispatch]);

  const topUps = ['Khalti', 'Esewa', 'FonePay']; // Rs 10, 50, 100
  const payments = [250, 500, 1000]; // Rs 2.50, 5, 10

  return (
    <ScreenContainer title="TransitPay Wallet">
      {/* Balance */}
      <View className="bg-black flex flex-row justify-between p-5 py-10 rounded mb-6">
        <View>
          <Text className="text-gray-400 text-xl">Current Balance</Text>
          <Text className="text-white text-4xl font-bold mt-2">
            Rs {(balanceCents / 100).toFixed(2)}
          </Text>
        </View>
        <View>
          <Pressable>
            <Text className="text-red-500 mt-2">Refresh Balance</Text>
          </Pressable>
        </View>
      </View>

      {/* Quick Actions */}
      <Text className="text-lg font-semibold mb-2">Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        <TouchableOpacity className="bg-black/50 px-6 py-4 rounded mr-3">
          <Text className="text-white font-bold text-center">Scan QR</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-black/50 px-6 py-4 rounded mr-3">
          <Text className="text-white font-bold text-center">Add Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-black/50 px-6 py-4 rounded mr-3">
          <Text className="text-white font-bold text-center">Offers</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Top Up */}
      <Text className="text-lg font-semibold mb-2">
        Top-up using different wallets
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {topUps.map(wallet => (
          <TouchableOpacity className="bg-black/50 px-6 py-4 rounded mr-3">
            <Text className="text-white font-bold text-center">{wallet}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Send / Pay */}
      <Text className="text-lg font-semibold mb-2">Send / Pay</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {payments.map(amt => (
          <TouchableOpacity
            key={amt}
            className="bg-red-600 px-6 py-4 rounded-xl mr-3"
            onPress={() => dispatch(serverDeduct(amt))}
          >
            <Text className="text-white font-bold text-center">
              Rs {(amt / 100).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recent Transactions */}
      <Text className="text-lg font-semibold mb-2">Recent Transactions</Text>
      {trips.length === 0 ? (
        <Text className="text-gray-500 mb-4">No recent transactions</Text>
      ) : (
        trips.map(t => (
          <View
            key={t.id}
            className="bg-gray-100 p-4 rounded-xl mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="font-semibold text-gray-900">{t.route}</Text>
              <Text className="text-gray-600 text-sm">
                Rs {(t.fareCents / 100).toFixed(2)} •{' '}
                {new Date(t.timestamp).toLocaleDateString()}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm">
              Txn: {t.id.slice(0, 6)}...
            </Text>
          </View>
        ))
      )}

      <Text className="text-gray-400 text-sm mt-4">
        * This is a simulation. Real transactions will redirect to eSewa
        gateway.
      </Text>
    </ScreenContainer>
  );
};

export default WalletScreen;
