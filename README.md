# Shield API

A simple demostration of creating Solana's DeFi data analytics api toolkit with only QuickNode products (stream & functions) and 0 additional infrastructure.

Imagine trying to monitor thousands of DeFi transactions every second — tracking user positions, identifying whale movements, or catching arbitrage opportunities.

It’s like trying to spot individual raindrops in a thunderstorm. That’s the challenge developers face when building DeFi applications on Solana. Every trade, every liquidation, and every position change needs to be caught, processed, and acted upon instantly.

Shield changes this game entirely. Instead of drowning in complex transaction logs or missing critical market moments, developers can now tap into a real-time stream of clean, structured data that’s ready for analysis.

Whether you’re building a trading bot, training an AI model, or monitoring risk positions, Shield transforms raw Solana transaction chaos into actionable intelligence.

## Useful Resources
Demo Video: https://www.loom.com/share/e09b06ecd2db4193bdc7084142986781?sid=99826a22-5b57-444d-9eab-c9f29548f8a4

Article: https://donatusprince.medium.com/building-shield-leveraging-quicknode-streams-function-for-real-time-defi-transaction-monitoring-5bedc10909c3

**Tools Used**

- QuickNode Streams - | [docs](https://www.quicknode.com/docs/streams/getting-started?utm_source=qn-github&utm_campaign=metrics-api)
- QuickNode Functions -  [docs](https://www.quicknode.com/docs/functions/getting-started?utm_source=qn-github&utm_campaign=metrics-api)
- QuickNode Key-Value Store - [docs](https://www.quicknode.com/docs/key-value-store/getting-started?utm_source=qn-github&utm_campaign=metrics-api)

## Project Details

### Goals

- provide a comprehensive DeFianalytics API
- require 0 infrastructure outside of QuickNode tools `minimizes costs`
- supports only Solana for now
- minimize the number of KV Store reads when possible `minimizes costs` `improves efficiency`
- minimize function evocations when possible `minimizes costs`

### Design

- QN Stream pipes data from blockchain
- Stream filter code processes and stores analytics data within QN KV Store
- Stream filter returns null, sending no data to a destination `minimizes costs`
- Stream filter logic & data structure in KV store are designed to enable parallel streams to be running `improves efficiency` `improves maintainability`
- QN Functions, one per method, read the data from KV Store and return convenient data structures
- Functions can be invoked via API

<details>
  <summary>Data Structure Within KV Store</summary>
</details>

## API Methods

### getAllTransactions

Get all Solana DeFi's transactions from the quicknode stream

**Parameters**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| stream | Object | yes | - | Transaction stream object containing transaction data |
| stream.data | Array | yes | - | Raw transaction data contained within the stream |
| limit | number | no | null | Maximum number of transactions to return |

<details>
<summary>Sample Request</summary>

```bash
curl -X POST "https://api.quicknode.com/functions/rest/v1/functions/ea3c5ff3-81b0-4535-9397-b1cafff84751/call" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "user_data": {
      "limit": 10
    }
  }'
```

</details>

<details>
<summary>Sample Response</summary>

```json
{
    "accountChanges": [
      {
        "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "balanceChange": 0
      },
      {
        "address": "7e4saqFjTrVNFgxh4u6EQJHYQzKeV3Wp9T2JDnXzRNYm",
        "balanceChange": 0
      },
      {
        "address": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        "balanceChange": 0
      },
      {
        "address": "AQjfCJru4sghQBCicErMds15m4dmkg3jVC4tk7c5qxkA",
        "balanceChange": 0
      },
      {
        "address": "6CEKRLzqjJaEHvirtGyfrRDqYHYWeJ933VxwrcVi1pbG",
        "balanceChange": 0
      },
      {
        "address": "7KyxcCFZqDnxcaBCYNVQf7gbkW34Gpb4H9YiPn4iKf4J",
        "balanceChange": -1306928053
      },
      {
        "address": "j4N8pcorhRX8KwP6zyjgnBmzMyUwFjyifrmX3n3Umpg",
        "balanceChange": 0
      },
      {
        "address": "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
        "balanceChange": 0
      },
      {
        "address": "Ebc56sgSD7rh27rHYZAMgdGojT2JWtTK3ng2Rt6Qhxdv",
        "balanceChange": 0
      },
      {
        "address": "6JQAZ6ZZpWdLC7pJRAgx2dN26vE4JjryvhwBf34FifsY",
        "balanceChange": 0
      },
      {
        "address": "4GXFb44GLqZx5yntYE19dq4vWsQCssKr8UPwe19WyQsE",
        "balanceChange": 0
      },
      {
        "address": "J16RMUWyeg6xtWuKFb8iEPsxVXHC4f1WiCQLtucpKqse",
        "balanceChange": 0
      },
      {
        "address": "B1h74rQHhFRyanohfgtmADGJ571EApHGh8PjdArHC23C",
        "balanceChange": 0
      },
      {
        "address": "28iTwrXTmLXGGXhFT2S2moA3CBHhG1GiLDEWgYuVDKfb",
        "balanceChange": 0
      },
      {
        "address": "DRpaYeN2U9LF9DeCt4joZfJwKNt7epptwekCC2QLEUCd",
        "balanceChange": 0
      },
      {
        "address": "2u1SZw4sLSSiFQcy4AQH9a1rdJ6HP133ZE96cfQ3FWBE",
        "balanceChange": -2039280
      },
      {
        "address": "BvDsmrzaDdtqJtr2pe4BADU2eViqJYz7G7QPNzitu75d",
        "balanceChange": 0
      },
      {
        "address": "HdJ25fEauUh4GFjoxdVjQwMKdfRRrP9nyb1f6xj3qigD",
        "balanceChange": 1300964073
      }
    ],
    "blockSlot": 308943544,
    "instruction": {
      "data": "6SAF3BYcF4JQmG1GbDbMLt7",
      "index": 4
    },
    "lastUpdated": "2024-12-22T07:00:33.997Z",
    "logs": [
      "Program log: Instruction: InitializeAccount",
      "Program log: Instruction: Transfer",
      "Program log: Instruction: Transfer",
      "Program log: Instruction: CloseAccount",
      "Program log: Instruction: CloseAccount"
    ],
    "processedAt": "2024-12-22T07:00:33.997Z",
    "program": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    "protocol": "RAYDIUM",
    "subType": "OPEN_BOOK",
    "success": false,
    "timestamp": 1734810724,
    "tokenTransfers": [
      {
        "amount": 326.122211348,
        "decimals": 9,
        "mint": "So11111111111111111111111111111111111111112",
        "owner": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        "rawAmount": "326122211348"
      },
      {
        "amount": 69596155.55726,
        "decimals": 6,
        "mint": "97chgb7EwbGoMtDT2aWZ9MVsujGvxbgaGKZFMbg6pump",
        "owner": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        "rawAmount": "69596155557260"
      },
      {
        "amount": 0,
        "decimals": 9,
        "mint": "So11111111111111111111111111111111111111112",
        "owner": "DRpaYeN2U9LF9DeCt4joZfJwKNt7epptwekCC2QLEUCd",
        "rawAmount": "0"
      },
      {
        "amount": 0,
        "decimals": 6,
        "mint": "97chgb7EwbGoMtDT2aWZ9MVsujGvxbgaGKZFMbg6pump",
        "owner": "DRpaYeN2U9LF9DeCt4joZfJwKNt7epptwekCC2QLEUCd",
        "rawAmount": "0"
      }
    ],
    "transactionId": "2VoHoxTax2HcTfgWruFkDxGHKV5cGyKoGmHXr3XHP4WaGxLRjMJfiv64e2nakUStDxac6sKmFeEr5nx7ha2KVQwi",
    "type": "InitializeAccount",
    "userBalanceChange": 0,
    "userWallet": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"
  },
```

</details>

<br>
<br>