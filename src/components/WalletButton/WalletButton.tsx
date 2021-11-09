import React, { Suspense } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { Button, Hidden, makeStyles, Popover } from '@material-ui/core';

import { WALLET_ICONS } from 'config/constants';
import {
  useMyAddress,
  useSetWalletModalOpen,
  useWalletAuth,
} from 'recoilState';
import { shortenAddress } from 'utils';

const useStyles = makeStyles(theme => ({
  popover: {
    marginTop: theme.spacing(1),
    borderRadius: 8,
    boxShadow: 'none',
  },
}));

export const AccountButton = () => {
  const classes = useStyles();
  const web3Context = useWeb3React<Web3Provider>();
  const { connectorName } = useWalletAuth();
  const myAddress = useMyAddress();

  const [anchorEl, setAnchorEl] = React.useState<
    HTMLButtonElement | undefined
  >();

  const Icon = connectorName ? WALLET_ICONS?.[connectorName] : undefined;

  return (
    <>
      <Button
        variant="outlined"
        color="default"
        size="small"
        startIcon={<Hidden smDown>{Icon && <Icon />}</Hidden>}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        {shortenAddress(myAddress)}
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.popover,
        }}
        onClose={() => setAnchorEl(undefined)}
        open={!!anchorEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            web3Context.deactivate();
            setAnchorEl(undefined);
          }}
        >
          Disconnect
        </Button>
      </Popover>
    </>
  );
};

export const WalletButton = () => {
  const setWalletModalOpen = useSetWalletModalOpen();

  // The AccountButton will suspend when myAddress isn't available.
  return (
    <Suspense
      fallback={
        <Button
          variant="outlined"
          color="default"
          size="small"
          onClick={() => setWalletModalOpen(true)}
        >
          Connect your wallet
        </Button>
      }
    >
      <AccountButton />
    </Suspense>
  );
};
