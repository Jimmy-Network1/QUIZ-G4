import BluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {PermissionsAndroid, Platform} from 'react-native';

/**
 * BluetoothService handles 1v1 P2P communication via Bluetooth.
 */
class BluetoothService {
  private connectedDevice: BluetoothDevice | null = null;
  private onMessageReceived: ((message: any) => void) | null = null;

  async requestPermissions() {
    if (Platform.OS === 'ios') {
      return true;
    }

    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return Object.values(granted).every(
        res => res === PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  async checkAndEnableBluetooth() {
    try {
      const enabled = await BluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        return await BluetoothClassic.requestBluetoothEnabled();
      }
      return true;
    } catch (err) {
      console.error('Error enabling bluetooth', err);
      return false;
    }
  }

  async listPairedDevices() {
    try {
      return await BluetoothClassic.getBondedDevices();
    } catch (err) {
      console.error('Error listing paired devices', err);
      return [];
    }
  }

  async startDiscovery() {
    try {
      return await BluetoothClassic.startDiscovery();
    } catch (err) {
      console.error('Error starting discovery', err);
      return [];
    }
  }

  async connectToDevice(device: BluetoothDevice) {
    try {
      // Options de connexion robustes pour Android
      const connected = await device.connect({
        connectorType: 'rfcomm',
        secure: true,
      });
      if (connected) {
        this.connectedDevice = device;
        this.startReading();
      }
      return connected;
    } catch (err) {
      console.error('Connection failed', err);
      return false;
    }
  }

  async acceptConnection() {
    try {
      console.log('📡 Serveur Bluetooth en attente...');
      const device = await BluetoothClassic.accept({
        serviceName: 'KnowarQuiz',
        serviceUuid: '00001101-0000-1000-8000-00805F9B34FB', // SPP Standard
        acceptTimeout: 30000, // Attendre 30 secondes
      });
      if (device) {
        this.connectedDevice = device;
        this.startReading();
      }
      return device;
    } catch (err) {
      console.warn('Accept timeout or failed');
      return null;
    }
  }

  private async startReading() {
    if (!this.connectedDevice) {
      return;
    }

    console.log('📖 Démarrage de la lecture Bluetooth...');
    while (this.connectedDevice) {
      try {
        const message = await this.connectedDevice.read();
        if (message && this.onMessageReceived) {
          try {
            // Suppression des retours à la ligne éventuels
            const cleanMessage = message.toString().trim();
            if (cleanMessage) {
              const parsed = JSON.parse(cleanMessage);
              this.onMessageReceived(parsed);
            }
          } catch (e) {
            console.log('Non-JSON message received:', message);
          }
        }
        // Petit délai pour ne pas bloquer le thread principal
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        console.log('Bluetooth connection lost');
        this.connectedDevice = null;
        break;
      }
    }
  }

  async send(message: any) {
    if (!this.connectedDevice) {
      return false;
    }
    try {
      const payload = JSON.stringify(message) + '\n';
      await this.connectedDevice.write(payload);
      return true;
    } catch (err) {
      console.error('Send failed', err);
      return false;
    }
  }

  setMessageHandler(handler: (msg: any) => void) {
    this.onMessageReceived = handler;
  }

  disconnect() {
    if (this.connectedDevice) {
      this.connectedDevice.disconnect();
      this.connectedDevice = null;
    }
  }
}

export default new BluetoothService();
