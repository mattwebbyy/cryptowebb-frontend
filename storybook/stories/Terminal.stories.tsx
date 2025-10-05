import type { Meta, StoryObj } from '@storybook/react';
import { Terminal } from '../../src/components/matrix/Terminal';

const meta: Meta<typeof Terminal> = {
  title: 'Matrix/Terminal',
  component: Terminal,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-black p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lines: [
      'Initializing CryptoWebb system...',
      'Loading blockchain data...',
      'Connecting to Matrix network...',
      'System ready.'
    ]
  }
};

export const SingleLine: Story = {
  args: {
    lines: ['Welcome to the Matrix']
  }
};

export const ShortCommands: Story = {
  args: {
    lines: [
      'ls -la',
      'cd blockchain/',
      'npm start',
      'System online'
    ]
  }
};

export const LongOutput: Story = {
  args: {
    lines: [
      'Scanning blockchain for anomalies...',
      'Found 1,247 transactions in the last block',
      'Analyzing smart contract bytecode...',
      'Detecting potential vulnerabilities...',
      'Cross-referencing with known attack patterns...',
      'Security scan complete - No threats detected',
      'Matrix interface ready for deployment',
      'All systems operational'
    ]
  }
};

export const ErrorMessages: Story = {
  args: {
    lines: [
      'Attempting connection to mainnet...',
      'ERROR: Connection timeout',
      'Retrying with backup node...',
      'WARNING: High network latency detected',
      'Connection established successfully',
      'System stabilized'
    ]
  }
};

export const CodeExecution: Story = {
  args: {
    lines: [
      'function calculateHash(data) {',
      '  return sha256(data + nonce);',
      '}',
      '',
      'Executing smart contract...',
      'Gas used: 21,000',
      'Transaction confirmed'
    ]
  }
};

export const WithLoading: Story = {
  args: {
    lines: [
      'Initializing quantum encryption...',
      'Generating cryptographic keys...',
      'Establishing secure tunnel...',
      'Loading...'
    ]
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-black p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <h3 className="text-matrix-green text-center mb-6 text-lg font-semibold font-mono">
            SYSTEM BOOT SEQUENCE
          </h3>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const CryptoAnalysis: Story = {
  args: {
    lines: [
      'Starting CryptoWebb Analytics Engine...',
      'Loading market data from 15 exchanges...',
      'Processing 127,394 transactions...',
      'Calculating technical indicators...',
      'RSI: 67.42 | MACD: Bullish | Volume: +15%',
      'Sentiment analysis complete: 78% positive',
      'Price prediction model trained',
      'Ready for real-time analysis'
    ]
  }
};

export const HackingSequence: Story = {
  args: {
    lines: [
      'root@cryptowebb:~# nmap -sS target.blockchain.net',
      'Starting Nmap scan...',
      'Host is up (0.0023s latency)',
      'PORT     STATE SERVICE',
      '8545/tcp open  ethereum',
      '30303/tcp open  ethereum-p2p',
      'root@cryptowebb:~# connect --secure',
      'Connection established. Welcome to the Matrix.'
    ]
  }
};

export const FullScreenDemo: Story = {
  render: (args) => (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-mono text-matrix-green mb-2 tracking-wider">
            CRYPTOWEBB TERMINAL
          </h1>
          <div className="h-1 bg-matrix-green/30 w-full mb-4"></div>
        </div>
        <Terminal {...args} />
        <div className="mt-8 text-center text-matrix-green/60 font-mono text-sm">
          System Status: ONLINE | Security Level: MAXIMUM | Node: matrix-01
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    lines: [
      'Establishing connection to the Matrix...',
      'Bypassing firewalls...',
      'Decrypting blockchain signatures...',
      'Accessing distributed ledger...',
      'Loading cryptocurrency data...',
      'Parsing smart contracts...',
      'Analyzing market patterns...',
      'Neural network activated',
      'Quantum algorithms initialized',
      'Welcome to CryptoWebb. You are now connected.'
    ]
  }
};