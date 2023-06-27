import { Fragment, useState } from "react";
import { BulkDeleteButton, useRefresh, useUnselectAll } from "react-admin";
import EventIcon from "@material-ui/icons/Event";
import Button from "@material-ui/core/Button";

import useToggle from "hooks/useToggle";

import SendMailModal from "./SendMailModal";

const MailListBulkActionButtons = (props) => {
  const { selectedIds } = props;
  const onRefresh = useRefresh();
  const onUnSelectAll = useUnselectAll();
  const [isShowingSendMailModal, onToggleSendMailModal] = useToggle();
  const [testSendMailMode, setTestSendMailMode] = useState(false);

  function handleToggleSendMailModal() {
    setTestSendMailMode(false);
    onToggleSendMailModal();
  }

  function handleToggleTestSendMailModal() {
    setTestSendMailMode(true);
    onToggleSendMailModal();
  }

  function handleCloseSendMailModal() {
    if (isShowingSendMailModal) {
      onRefresh();
    }

    onToggleSendMailModal();
    onUnSelectAll("mail");
  }

  return (
    <Fragment>
      <BulkDeleteButton {...props} />
      <Button color="primary" size="small" startIcon={<EventIcon />} onClick={handleToggleSendMailModal}>
        메일 전송 팝업
      </Button>
      <Button color="primary" size="small" startIcon={<EventIcon />} onClick={handleToggleTestSendMailModal}>
        테스트 메일 전송 팝업
      </Button>
      <SendMailModal
        isShowing={isShowingSendMailModal}
        selectedIds={selectedIds}
        onClose={handleCloseSendMailModal}
        isTestMode={testSendMailMode}
      />
    </Fragment>
  );
};

export default MailListBulkActionButtons;
