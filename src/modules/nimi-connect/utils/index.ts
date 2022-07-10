import { StaticJsonRpcProvider } from '@ethersproject/providers';

/**
 * Resolves an ENS name to an address.
 * @param ensName The ENS name to resolve.
 * @returns The address of the ENS name.
 */
export function resolveENSName(ensName: string): Promise<string | null> {
  const mainnetProvider = new StaticJsonRpcProvider();

  return mainnetProvider.resolveName(ensName);
}

