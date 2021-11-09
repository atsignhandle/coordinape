import { useRecoilState, useRecoilValue } from 'recoil';

import {
  CircleSelectModal,
  LoadingModal,
  EditProfileModal,
  WalletAuthModal,
} from 'components';
import {
  rGlobalLoading,
  rGlobalLoadingText,
  rCircleSelectorOpen,
  useStateEditProfileOpen,
  useStateWalletModalOpen,
} from 'recoilState';

export const GlobalUi = () => {
  return (
    <>
      <GlobalLoadingModal />
      <GlobalEditProfileModal />
      <GlobalCircleSelectModal />
      <GlobalWalletAuthModal />
    </>
  );
};

const GlobalLoadingModal = () => {
  const globalLoading = useRecoilValue(rGlobalLoading);
  const globalLoadingText = useRecoilValue(rGlobalLoadingText);

  return <LoadingModal text={globalLoadingText} visible={globalLoading > 0} />;
};

const GlobalEditProfileModal = () => {
  const [editProfileOpen, setEditProfileOpen] = useStateEditProfileOpen();
  return (
    <EditProfileModal
      open={editProfileOpen}
      onClose={() => setEditProfileOpen(false)}
    />
  );
};

const GlobalCircleSelectModal = () => {
  const [circleSelectorOpen, setCircleSelectorOpen] =
    useRecoilState(rCircleSelectorOpen);
  return (
    <CircleSelectModal
      onClose={() => setCircleSelectorOpen(false)}
      visible={circleSelectorOpen}
    />
  );
};

const GlobalWalletAuthModal = () => {
  const [walletModalOpen, setWalletModalOpen] = useStateWalletModalOpen();

  return (
    <WalletAuthModal open={walletModalOpen} setOpen={setWalletModalOpen} />
  );
};
