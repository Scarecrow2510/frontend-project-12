import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import useNetwork from '../../hooks/networkHook';
import useSocket from '../../hooks/chatApiHook';

const Rename = ({ onHide, modalInfo }) => {
  const network = useNetwork();
  const chatApi = useSocket();
  const inputRef = useRef();
  const channels = useSelector((state) => state.channels.allChannels);
  const { t } = useTranslation();

  const channelRenameSchema = yup.object().shape({
    newChannelName: yup
      .string()
      .min(3, 'errors.symbolsLength')
      .max(20, 'errors.symbolsLength')
      .test('is-unique', 'errors.mustBeUnique', (newChannelName) => !channels.some((channel) => channel.name === newChannelName))
      .test('no-profanity', 'errors.profanity', (channelName) => !filter.check(channelName))
      .required('errors.requiredField'),
  });

  const f = useFormik({
    initialValues: {
      newChannelName: modalInfo.item.name,
      channelId: modalInfo.item.id,
      channelRemovable: modalInfo.item.removable,
    },
    validationSchema: channelRenameSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async () => {
      const newData = {
        name: f.values.newChannelName,
        id: f.values.channelId,
        removable: f.values.channelRemovable,
      };
      await chatApi.sendRenamedChannel(newData)
        .then(() => {
          toast.success(t('toastify.rename'));
          onHide();
        })
        .catch(() => toast.danger(t('errors.toastifyRename')));
    },
  });

  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title className="p-1">{t('modals.renameModal.renameChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit} noValidate>
          <Form.Group>
            <Form.Control
              required
              className={`mb-2 form-control ${f.errors.newChannelName ? 'is-invalid' : ''}`}
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={network.isOnline ? f.values.newChannelName : t('errors.network')}
              autoComplete="off"
              data-testid="input-body"
              id="newChannelName"
              name="newChannelName"
            />
            <Form.Label className="visually-hidden" htmlFor="newChannelName">{t('modals.channelName')}</Form.Label>
            {f.touched.newChannelName && f.errors.newChannelName && (
            <div className="invalid-feedback mb-2">
              {t(f.errors.newChannelName)}
            </div>
            )}
          </Form.Group>
          <Form.Group className="d-flex justify-content-start mt-3">
            <Button type="submit" variant={network.isOnline ? 'primary' : 'danger'} disabled={!network.isOnline}>{t('modals.renameModal.renameButton')}</Button>
            <Button onClick={() => onHide()} type="submit" variant="secondary" className="ms-2">{t('modals.cancelButton')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
