import { useAuthStore } from '../../store/useAuthStore';

interface EthereumProvider {
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

interface WalletConnection {
  account: string;
  chainId: string;
}

class WalletConnector {

  private provider: EthereumProvider | null = null;
  private account: string | null = null;
  private chainId: string | null = null;
  private user: any | null = null;

  // Event handlers (optional)
  public onAccountChanged?: (account: string) => void;
  public onNetworkChanged?: (chainId: string) => void;
  public onDisconnected?: () => void;
  
  public isMetaMaskInstalled = (): boolean => {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  }

  private getProvider(): EthereumProvider | null {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    const ethereum = (window as any).ethereum as EthereumProvider;

    // Check for multiple wallet providers
    if (ethereum?.providers && ethereum.providers.length > 0) {
      // Find MetaMask specifically
      return ethereum.providers.find(
        (provider: EthereumProvider) => provider.isMetaMask
      ) || null;
    }

    return ethereum?.isMetaMask ? ethereum : null;
  }

  public async connectWallet(): Promise<WalletConnection> {
    this.provider = this.getProvider();
    if (!this.provider) {
      throw new Error('MetaMask not found');
    }

    // Request account access
    const accounts: string[] = await this.provider.request({
      method: 'eth_requestAccounts'
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    this.account = accounts[0];

    // Get current chain ID
    this.chainId = await this.provider.request({
      method: 'eth_chainId'
    });
    try {
      // Set up event listeners
      this.setupEventListeners();

      // Integrate with SIWE-based auth system
      if (this.account) {
        await this.authenticateWithServer();
      }
      console.log('Wallet connected:', this.account);
      console.log('chain id:', this.chainId);
      return {
        account: this.account || '',
        chainId: this.chainId || ''
      };
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.provider) return;

    // Account changed
    this.provider.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.account = accounts[0];
        this.onAccountChanged?.(accounts[0]);
      }
    });

    // Network changed
    this.provider.on('chainChanged', (chainId: string) => {
      this.chainId = chainId;
      this.onNetworkChanged?.(chainId);
      // Reload page to avoid stale state
      window.location.reload();
    });

    // Connection lost
    this.provider.on('disconnect', (error: any) => {
      console.log('Wallet disconnected:', error);
      this.disconnect();
    });
  }

  public disconnect(): void {
    this.provider = null;
    this.account = null;
    this.chainId = null;
    this.onDisconnected?.();
  }

  private async authenticateWithServer(): Promise<void> {
    if (!this.account) {
      throw new Error('No account to authenticate');
    }

    try {
      const nonceRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/nonce?address=${this.account}`);
      if (!nonceRes.ok) {
        const err = await nonceRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to get nonce');
      }

      const { nonce, message } = await nonceRes.json();
      const signature = await this.provider!.request({
        method: 'personal_sign',
        params: [message, this.account]
      });

      // Verify signature with server
      const verifyRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: this.account, signature, nonce })
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        console.error('Verification failed:', err);
        throw new Error(err.error || 'Verification failed');
      }

      const { token, user, session } = await verifyRes.json();

      if (!user || !session) {
        throw new Error('Verification did not return a user and session');
      }

      let cleanWalletAddress = this.account; // Use the original account as fallback
      const cleanUser = {
        ...user,
        walletAddress: cleanWalletAddress,
      };
      sessionStorage.setItem('tokenUser', token);
      sessionStorage.setItem('authUser', JSON.stringify(cleanUser));
      const setUser = useAuthStore.getState().setUser;
      setUser(cleanUser);
      this.user = cleanUser;

      return cleanUser;
    } catch (error) {
      console.error('Server authentication failed:', error);
      throw error;
    }
  }
}

export const getWalletConnector = () => {
  return new WalletConnector();
};

export default {
  getWalletConnector,
};

