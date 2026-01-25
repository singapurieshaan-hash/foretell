import type { WalletState } from '@/types';

/**
 * Wallet integration helpers
 * Supports EVM (Ethereum, Polygon, Arbitrum) and Solana
 * with demo mode for development
 */

export interface WalletConfig {
  demoMode: boolean;
  network: 'ethereum' | 'solana' | 'demo';
  rpcUrl?: string;
  usdcContract?: string;
  escrowAddress?: string;
}

const DEMO_WALLET: WalletState = {
  address: '0x1234567890123456789012345678901234567890',
  balance: 10000, // $10k USDC
  network: 'demo',
  connected: false,
};

/**
 * Initialize wallet based on environment and mode
 */
export function initializeWallet(config: WalletConfig): WalletState {
  if (config.demoMode) {
    return { ...DEMO_WALLET, connected: true };
  }

  // In production, would initialize wagmi/Solana adapters
  return {
    address: undefined,
    balance: 0,
    network: config.network,
    connected: false,
  };
}

/**
 * Check if wallet is properly configured for trading
 */
export function isWalletReady(wallet: WalletState): boolean {
  return wallet.connected && wallet.address !== undefined && wallet.balance > 0;
}

/**
 * Get balance in displayable format
 */
export function formatBalance(balance: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);
}

/**
 * Calculate position value
 */
export function calculatePositionValue(
  quantity: number,
  price: number
): number {
  return quantity * price;
}

/**
 * Calculate fee for a trade
 */
export function calculateTradeFee(quantity: number, price: number, feePercentage = 0.02): number {
  return quantity * price * feePercentage;
}

/**
 * Get network display name
 */
export function getNetworkName(network: string): string {
  const names: Record<string, string> = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum',
    solana: 'Solana',
    demo: 'Demo Mode',
  };
  return names[network] || network;
}

/**
 * Check if address is valid (demo or EVM format)
 */
export function isValidAddress(address: string | undefined): boolean {
  if (!address) return false;
  if (address.startsWith('0x')) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  return address.length > 0; // Solana addresses are longer
}

/**
 * Simulate wallet approval for demo mode
 */
export async function simulateApproveUSDC(): Promise<{ success: boolean; txHash?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        txHash: `0x${Math.random().toString(16).slice(2)}`,
      });
    }, 1000);
  });
}

/**
 * Simulate transfer for demo mode
 */
export async function simulateTransfer(): Promise<{ success: boolean; txHash?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        txHash: `0x${Math.random().toString(16).slice(2)}`,
      });
    }, 1500);
  });
}

/**
 * Get transaction explorer URL
 */
export function getExplorerUrl(
  txHash: string,
  network: string
): string {
  const urls: Record<string, string> = {
    ethereum: `https://etherscan.io/tx/${txHash}`,
    polygon: `https://polygonscan.com/tx/${txHash}`,
    arbitrum: `https://arbiscan.io/tx/${txHash}`,
    solana: `https://solscan.io/tx/${txHash}`,
  };
  return urls[network] || '#';
}
