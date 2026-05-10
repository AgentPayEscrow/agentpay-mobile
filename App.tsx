import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Mock wallet connection (replace with actual Freighter)
const connectWallet = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('GABC123XYZ789...'), 1000);
  });
};

// Mock data
interface Agent {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'paused';
  balance: number;
  totalSpent: number;
}

// Screens
function HomeScreen({ navigation, walletAddress, setWalletAddress }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentAddress, setNewAgentAddress] = useState('');

  useEffect(() => {
    // Load mock agents
    if (walletAddress) {
      setAgents([
        { id: '1', name: 'Trading Bot', address: 'GABC123...', status: 'active', balance: 500, totalSpent: 200 },
        { id: '2', name: 'Payment Processor', address: 'GDEF456...', status: 'active', balance: 1000, totalSpent: 300 },
      ]);
    }
  }, [walletAddress]);

  const handleConnect = async () => {
    const address = await connectWallet();
    setWalletAddress(address);
  };

  const createAgent = () => {
    if (!newAgentName || !newAgentAddress) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      address: newAgentAddress.substring(0, 10) + '...',
      status: 'active',
      balance: 0,
      totalSpent: 0,
    };
    setAgents([newAgent, ...agents]);
    setModalVisible(false);
    setNewAgentName('');
    setNewAgentAddress('');
    Alert.alert('Success', 'Agent created!');
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(agent =>
      agent.id === id
        ? { ...agent, status: agent.status === 'active' ? 'paused' : 'active' }
        : agent
    ));
  };

  if (!walletAddress) {
    return (
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>🤖 AgentPay</Text>
          <Text style={styles.subtitle}>AI Agent Payment Platform</Text>
          <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
            <Text style={styles.buttonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AgentPay</Text>
          <View style={styles.walletBadge}>
            <Text style={styles.walletText}>
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agents.length}</Text>
            <Text style={styles.statLabel}>Total Agents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${agents.reduce((sum, a) => sum + a.totalSpent, 0)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonText}>+ Create New Agent</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My Agents</Text>

        {agents.map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View>
              <Text style={styles.agentName}>{agent.name}</Text>
              <Text style={styles.agentAddress}>{agent.address}</Text>
            </View>
            <View>
              <Text style={styles.agentBalance}>${agent.balance}</Text>
              <TouchableOpacity
                style={[styles.statusButton, agent.status === 'active' ? styles.activeButton : styles.pausedButton]}
                onPress={() => toggleAgentStatus(agent.id)}
              >
                <Text style={styles.statusButtonText}>
                  {agent.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Agent</Text>
              <TextInput
                style={styles.input}
                placeholder="Agent Name"
                placeholderTextColor="#666"
                value={newAgentName}
                onChangeText={setNewAgentName}
              />
              <TextInput
                style={styles.input}
                placeholder="Wallet Address"
                placeholderTextColor="#666"
                value={newAgentAddress}
                onChangeText={setNewAgentAddress}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={createAgent}>
                  <Text style={styles.confirmButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <HomeScreen walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#a1a1aa',
    marginBottom: 40,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletBadge: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  walletText: {
    color: '#a855f7',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  statLabel: {
    color: '#a1a1aa',
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#a855f7',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  agentCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  agentName: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  agentAddress: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  agentBalance: {
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
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
    fontSize: 12,
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
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#a855f7',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});