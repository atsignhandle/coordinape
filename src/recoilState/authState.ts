import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import {
  atom,
  selector,
  useRecoilValue,
  // useRecoilState,
  // useSetRecoilState,
  useRecoilCallback,
} from 'recoil';

import { getApiService } from 'services/api';
import { connectors } from 'utils/connectors';
import storage from 'utils/storage';
import { neverEndingPromise, assertDef } from 'utils/tools';

import { IAuth, EConnectorNames, IRecoilGetParams } from 'types';

// Only set rWalletAuth through exported functions below.
const rWalletAuth = atom<IAuth>({
  key: 'rWalletAuth',
  default: storage.getAuth(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(auth => {
        storage.setAuth(auth);
      });
    },
  ],
});
export const useWalletAuth = () => useRecoilValue(rWalletAuth);
export const useConnectorName = () => useRecoilValue(rWalletAuth).connectorName;

export const rMyAddress = selector<string>({
  key: 'rMyAddress',
  get: async ({ get }: IRecoilGetParams) => {
    const myAddress = get(rWalletAuth).address;
    return myAddress ?? neverEndingPromise<string>();
  },
});
export const useMyAddress = () => useRecoilValue(rMyAddress);

/**
 * updateAuth(values) to update auth state in recoil.
 * clearAuth() without args to reset recoil auth state.
 */
export const useUpdateAuthState = () => {
  const updateAuth = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({
        address,
        web3Context,
      }: {
        address: string;
        web3Context: Web3ReactContextInterface<Web3Provider>;
      }) => {
        const { authTokens } = await snapshot.getPromise(rWalletAuth);

        try {
          const connectorName = assertDef(
            Object.entries(connectors).find(
              ([, connector]) =>
                web3Context.connector?.constructor === connector.constructor
            )?.[0],
            'Unknown web3Context.connector'
          ) as EConnectorNames;

          getApiService().setProvider(web3Context.library);

          const token = authTokens[address];
          const manifest = await getApiService().getManifest(address);
          // TODO: remove:
          console.warn('updateAuth', manifest);
          if (token) {
            getApiService().setAuth(address, token);

            set(rWalletAuth, {
              connectorName,
              address,
              authTokens,
            });

            return;
          }
        } catch (e) {
          console.error('Failed to login', e);
        }

        delete authTokens[address];
        getApiService().setAuth(undefined, undefined);
        getApiService().setProvider(undefined);
        set(rWalletAuth, {
          authTokens,
        });
      }
  );

  const clearAuth = useRecoilCallback(({ snapshot, set }) => async () => {
    const { authTokens, address: original } = await snapshot.getPromise(
      rWalletAuth
    );

    if (original) {
      delete authTokens[original];
    }
    getApiService().setAuth(undefined, undefined);
    getApiService().setProvider(undefined);
    set(rWalletAuth, {
      authTokens,
    });
    return;
  });

  return {
    updateAuth,
    clearAuth,
  };
};
