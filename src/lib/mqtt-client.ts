import mqtt from 'mqtt';
/* eslint-disable */

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || '';
const MQTT_TOPICS = [
  'SABDA/VR',
  'SABDA/VS',
  'SABDA/VT',
  'SABDA/IR',
  'SABDA/IS',
  'SABDA/IT',
  'SABDA/KWH',
];

export const client = mqtt.connect(MQTT_BROKER_URL, {
  keepalive: 60,
  protocolId: 'MQTT',
  protocolVersion: 4,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');

  client.subscribe(MQTT_TOPICS, (err) => {
    if (err) {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', async(topic, message) => {
  const data = JSON.parse(message.toString());
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString() : 'No timestamp';

  console.log(`Topic: ${topic}, Message: ${JSON.stringify(data)}, Timestamp: ${timestamp}`);
});

client.on('error', (error) => {
  console.error('MQTT Client Error:', error);
});

client.on('reconnect', () => {
  console.log('Reconnecting to MQTT Broker...');
});