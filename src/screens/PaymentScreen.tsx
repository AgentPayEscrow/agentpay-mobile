import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Payment {
  id: string;
  agentId: string;
  amount: number;
  recipient: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  timestamp: Date;
  txHash?: string;
}

interface PaymentScreenProps {
  agentId: string;
  agentName: string;
  dailyLimit: number;
  remainingLimit: number;
}

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { agentId, agentName, dailyLimit, remainingLimit } = route.params as PaymentScreenProps;

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    loadRecentPayments();
  }, [agentId]);

  const loadRecentPayments = async () => {
    // Mock API call
    const mockPayments: Payment[] = [
      {
        id: '1',
        agentId: agentId,
        amount: 50,
        recipient: 'GABC123...',
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000),
        txHash: '0xabc123...',
      },
      {
        id: '2',
        agentId: agentId,
        amount: 25,
        recipient: 'GDEF456...',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000),
        txHash: '0xdef456...',
      },
    ];
    setRecentPayments(mockPayments);
  };

  const validatePayment = () => {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    
    if (amountNum > remainingLimit) {
      Alert.alert('Limit Exceeded', `Daily limit remaining: $${remainingLimit}`);
      return false;
    }
    
    if (!recipient || recipient.length < 10) {
      Alert.alert('Error', 'Please enter a valid recipient address');
      return false;
    }
    
    return true;
  };

  const executePayment = async () => {
    if (!validatePayment()) return;
    
    setShowConfirmModal(true);
  };

  const confirmPayment = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setPaymentStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setPaymentStatus('success');
      setLoading(false);
      
      Alert.alert(
        'Payment Successful',
        `$${amount} sent to ${recipient.substring(0, 10)}...`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              setRecipient('');
              setMemo('');
              loadRecentPayments();
              navigation.goBack();
            },
          },
        ]
      );
    }, 2000);
  };

  const formatAmount = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';
    return `$${num.toFixed(2)}`;
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#ef4444';
      default:
        return '#a1a1aa';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.agentName}>{agentName}</Text>
        <Text style={styles.limitText}>
          Daily Limit: ${dailyLimit} | Remaining: ${remainingLimit}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Amount (USDC)</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.amountPreview}>{formatAmount(amount)}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Recipient Address</Text>
        <TextInput
          style={styles.input}
          placeholder="G..."
          placeholderTextColor="#666"
          value={recipient}
          onChangeText={setRecipient}
        />

        <Text style={[styles.label, { marginTop: 20 }]}>Memo (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Payment reference"
          placeholderTextColor="#666"
          value={memo}
          onChangeText={setMemo}
        />

        <TouchableOpacity
          style={[styles.payButton, (!amount || !recipient) && styles.disabledButton]}
          onPress={executePayment}
          disabled={!amount || !recipient || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Execute Payment</Text>
          )}
        </TouchableOpacity>
      </View>

      {paymentStatus === 'success' && (
        <View style={styles.successCard}>
          <Text style={styles.successText}>✓ Payment Complete</Text>
          <Text style={styles.successSubtext}>
            Transaction hash: 0x{Math.random().toString(36).substring(2, 15)}
          </Text>
        </View>
      )}

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
        {recentPayments.map((payment) => (
          <View key={payment.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyAmount}>${payment.amount}</Text>
              <Text style={styles.historyRecipient}>
                {payment.recipient.substring(0, 10)}...
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.historyStatus, { color: getStatusColor(payment.status) }]}>
                {payment.status}
              </Text>
              <Text style={styles.historyTime}>
                {payment.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            <View style={styles.modalDetail}>
              <Text style={styles.modalLabel}>Amount:</Text>
              <Text style={styles.modalValue}>${amount}</Text>
            </View>
            <View style={styles.modalDetail}>
              <Text style={styles.modalLabel}>Recipient:</Text>
              <Text style={styles.modalValue}>{recipient.substring(0, 15)}...</Text>
            </View>
            <View style={styles.modalDetail}>
              <Text style={styles.modalLabel}>Agent:</Text>
              <Text style={styles.modalValue}>{agentName}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={confirmPayment}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  limitText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    color: '#a1a1aa',
    fontSize: 14,
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 48,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
  },
  amountPreview: {
    color: '#a855f7',
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#a855f7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successCard: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  successText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  successSubtext: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  historySection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyRecipient: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyTime: {
    color: '#a1a1aa',
    fontSize: 10,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalLabel: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  modalValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
  },
  modalConfirm: {
    flex: 1,
    padding: 12,
    backgroundColor: '#a855f7',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});