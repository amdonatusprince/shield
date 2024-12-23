# Shield Tooling: Solana Transaction Analytics Toolkit 🛡️

Shield is a simple transaction analytics toolkit for Solana that provides real-time monitoring, filtering, and analysis of on-chain activities across different Defi protocols. It leverages Quicknode's stream and functions to deliver streamlined data solutions to developers to track transaction volumes, wallet activities, token transfers, and protocol fees through a simple, unified interface.

Imagine trying to monitor thousands of DeFi transactions every second — tracking user positions, identifying whale movements, or catching arbitrage opportunities.

It’s like trying to spot individual raindrops in a thunderstorm. That’s the challenge developers face when building DeFi applications on Solana. Every trade, every liquidation, and every position change needs to be caught, processed, and acted upon instantly.

Shield changes this game entirely. Instead of drowning in complex transaction logs or missing critical market moments, developers can now tap into a real-time stream of clean, structured data that’s ready for analysis.

Whether you’re building a trading bot, training an AI model, or monitoring risk positions, Shield transforms raw Solana transaction chaos into actionable intelligence.

## Useful Resources
Demo Video: 
Article: https://donatusprince.medium.com/building-shield-leveraging-quicknode-streams-function-for-real-time-defi-transaction-monitoring-5bedc10909c3

## 🌟 Key Features

- Real-time transaction monitoring and filtering
- Protocol-specific analytics and volume tracking
- Wallet activity analysis and token transfer statistics
- Fee analysis and large transaction alerts
- Multi-protocol comparison and daily statistics
- AI-ready data structure for DeFi transaction analysis

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/yourusername/shield-analytics.git
cd shield-analytics
npm install
```

### UI Interface
To access the Shield Analytics dashboard:
```bash
cd shield_ui
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`

## 📊 API Usage

### Base URL
```
https://api.quicknode.com/functions/rest/v1/functions/ea3c5ff3-81b0-4535-9397-b1cafff84751/call
```

### Authentication
Include your API key in the headers:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY'
}
```

### Sample API Calls

1. **Get All Transactions**
```javascript
const data = {
  options: {
    type: 'all',
    limit: 10
  }
}
```

2. **Protocol-Specific Analysis**
```javascript
const data = {
  options: {
    type: 'byProtocol',
    protocol: 'JUPITER',
    limit: 10
  }
}
```

3. **Volume Statistics**
```javascript
const data = {
  options: {
    type: 'volume',
    protocol: 'JUPITER',
    timeframe: 3600 // Last hour
  }
}
```

4. **Wallet Analysis**
```javascript
const data = {
  options: {
    type: 'walletSearch',
    walletAddress: 'YOUR_WALLET_ADDRESS'
  }
}
```

### Complete API Example
```javascript
const axios = require('axios');

const url = 'https://api.quicknode.com/functions/rest/v1/functions/YOUR_QUICKNODE_FUNCTION_ID/call';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY'
};

const data = {
  options: {
    type: 'multiProtocolStats'
  }
};

axios.post(url, data, { headers })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

## 🔍 Use Cases

### 1. DeFi Protocol Analytics
- Track protocol usage and volume
- Monitor fee generation
- Analyze user behavior patterns
- Compare protocol performance

### 2. Wallet Tracking
- Monitor specific wallet activities
- Track large transactions
- Analyze token transfer patterns
- Identify active traders

### 3. Token Analysis
- Track token transfer volumes
- Monitor token holder activity
- Analyze token distribution
- Track mint activities

### 4. Risk Management
- Monitor large transactions
- Track unusual activity patterns
- Analyze protocol health
- Monitor fee structures

### 5. AI/ML Integration
Shield's structured data format makes it perfect for training AI models:
- Transaction pattern recognition
- Anomaly detection
- Price prediction
- User behavior analysis
- Protocol performance optimization

## 📋 Available Query Types

| Type | Description | Required Parameters |
|------|-------------|-------------------|
| `all` | Get all transactions | `limit` (optional) |
| `byProtocol` | Protocol-specific transactions | `protocol`, `limit` (optional) |
| `volume` | Protocol volume statistics | `protocol`, `timeframe` |
| `activeWallets` | Active wallet list | `protocol` |
| `transferStats` | Token transfer statistics | `protocol` |
| `alertLarge` | Large transaction monitoring | `threshold`, `callback` |
| `multiProtocolStats` | Cross-protocol comparison | none |
| `dailyStats` | Daily protocol statistics | `protocol` |
| `walletSearch` | Wallet transaction analysis | `walletAddress` |
| `protocolFees` | Protocol fee analysis | `protocol` (optional) |
| `valueTransferred` | Token transfer analysis | `mintAddress` |

## 🤖 AI Integration

Shield's data structure is specifically designed to be AI-friendly, making it perfect for:
- Training DeFi trading bots
- Building predictive models
- Developing risk assessment systems
- Creating automated monitoring systems
- Optimizing protocol parameters

Example AI use case:
```javascript
// Fetch training data
const trainingData = await fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    options: {
      type: 'multiProtocolStats',
      timeframe: 86400 * 30 // 30 days of data
    }
  })
});

// Use data for AI training
const model = await trainModel(trainingData);
```

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## 📮 Support

For support, email support@shield-analytics.com or join our [Discord community](https://discord.gg/shield-analytics).
