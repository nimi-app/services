interface SocialSource {
  id:
    | 'twitter'
    | 'github'
    | 'medium'
    | 'linkedin'
    | 'reddit'
    | 'telegram'
    | 'facebook'
    | 'instagram'
    | 'youtube'
    | 'email';
  label: string;
  url: string;
}

export type Network =
  | 'ethereum'
  | 'bitcoin'
  | 'polygon'
  | 'tron'
  | 'eos'
  | 'binance'
  | 'ripple'
  | 'dogecoin'
  | string;

interface WalletAddress {
  address: string;
  network: Network;
}

export interface Profile {
  displayName: string;
  description: string;
  profileImageUrl: string;
  ensAddress: string;
  ensName: string;
  socials: SocialSource[];
  addresses: WalletAddress[];
}

