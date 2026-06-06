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
      const connected = await device.connect();
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
      const device = await BluetoothClassic.accept({
        serviceName: 'KnowarQuiz',
        serviceUuid: '00001101-0000-1000-8000-00805F9B34FB', // Standard SPP UUID
      });
      if (device) {
        this.connectedDevice = device;
        this.startReading();
      }
      return device;
    } catch (err) {
      console.error('Accept failed', err);
      return null;
    }
  }

  private async startReading() {
    if (!this.connectedDevice) {
      return;
    }

    while (this.connectedDevice) {
      try {
        const message = await this.connectedDevice.read();
        if (message && this.onMessageReceived) {
          try {
            const parsed = JSON.parse(message);
            this.onMessageReceived(parsed);
          } catch (e) {
            console.log('Raw message received:', message);
          }
        }
      } catch (err) {
        console.log('Disconnected or read error');
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
