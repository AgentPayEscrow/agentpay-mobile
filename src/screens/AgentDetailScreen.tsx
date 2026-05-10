import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface AgentDetail {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'paused';
  balance: number;
  totalSpent: number;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  createdAt: Date;
  lastActivity: Date;
}

export const AgentDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { agentId } = route.params as { agentId: string };

  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAgentDetails();
  }, [agentId]);

  const loadAgentDetails = async () => {
    // Mock API call
    setTimeout(() => {
      setAgent({
        id: agentId,
        name: 'Trading Bot',
        address: 'GABC123XYZ789...',
        status: 'active',
        balance: 5000,
        totalSpent: 2000,
        dailyLimit: 1000,
        weeklyLimit: 5000,
        monthlyLimit: 20000,
        createdAt: new Date(Date.now() - 30 * 24 * 3600000),
        lastActivity: new Date(),
      });
      setLoading(false);
    }, 1000);
  };

  const toggleAgentStatus = async () => {
    setUpdating(true);
    // Mock API call
    setTimeout(() => {
      setAgent(prev => prev ? {
        ...prev,
        status: prev.status === 'active' ? 'paused' : 'active',
      } : null);
      setUpdating(false);
      Alert.alert(
        'Success',
        `Agent ${agent?.status === 'active' ? 'paused' : 'resumed'} successfully`
      );
    }, 1000);
  };

  const updateLimits = () => {
    Alert.alert('Update Limits', 'This feature coming soon', [
      { text: 'OK' },
    ]);
  };

  const makePayment = () => {
    navigation.navigate('Payment', {
      agentId: agent?.id,
      agentName: agent?.name,
      dailyLimit: agent?.dailyLimit,
      remainingLimit: agent?.dailyLimit - (agent?.totalSpent || 0),
    });
  };

  const viewTransactions = () => {
    Alert.alert('Transactions', 'View transaction history coming soon');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  if (!agent) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Agent not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.agentName}>{agent.name}</Text>
        <TouchableOpacity
          style={[
            styles.statusButton,
            agent.status === 'active' ? styles.activeButton : styles.pausedButton,
          ]}
          onPress={toggleAgentStatus}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.statusButtonText}>
              {agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={styles.statValue}>${agent.balance}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>${agent.totalSpent}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending Limits</Text>
        <View style={styles.limitItem}>
          <Text style={styles.limitLabel}>Daily</Text>
          <Text style={styles.limitValue}>${agent.dailyLimit}</Text>
        </View>
        <View style={styles.limitItem}>
          <Text style={styles.limitLabel}>Weekly</Text>
          <Text style={styles.limitValue}>${agent.weeklyLimit}</Text>
        </View>
        <View style={styles.limitItem}>
          <Text style={styles.limitLabel}>Monthly</Text>
          <Text style={styles.limitValue}>${agent.monthlyLimit}</Text>
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={updateLimits}>
          <Text style={styles.updateButtonText}>Update Limits</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.payButton} onPress={makePayment}>
          <Text style={styles.payButtonText}>Make Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyButton} onPress={viewTransactions}>
          <Text style={styles.historyButtonText}>View Transactions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Agent Address</Text>
        <Text style={styles.infoValue}>{agent.address}</Text>
        <Text style={styles.infoLabel}>Created</Text>
        <Text style={styles.infoValue}>{agent.createdAt.toLocaleDateString()}</Text>
        <Text style={styles.infoLabel}>Last Activity</Text>
        <Text style={styles.infoValue}>{agent.lastActivity.toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0c29',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(168,85,247,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'rgba(34,197,94,0.2)',
  },
  pausedButton: {
    backgroundColor: 'rgba(245,158,11,0.2)',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statLabel: {
    color: '#a1a1aa',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: '#a855f7',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  limitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  limitLabel: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  limitValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  updateButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(168,85,247,0.2)',
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    flexDirection: 'row',
    margin: 20,
    gap: 15,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#a855f7',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 4,
    marginTop: 12,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
  },
});