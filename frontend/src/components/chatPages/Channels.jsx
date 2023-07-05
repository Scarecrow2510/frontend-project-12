import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown, Button, Nav, Col,
} from 'react-bootstrap';
import { PlusSquareFill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { setActiveChannel } from '../../slices/channelsSlice';
import { onShow } from '../../slices/modalsSlice';

const RenderChannel = ({
  channel, handleClick, showModal, activeChannelId,
}) => {
  const { t } = useTranslation();
  const { id, name, removable } = channel;
  return (
    removable ? (
      <Nav.Item className="w-100" key={id} data-changecolour="hover">
        <Dropdown role="group" className="d-flex dropdown btn-group">
          <Button
            onClick={() => handleClick(id)}
            type="button"
            variant="white"
            id="channel-button-left"
            data-changecolour="hover"
            className={`w-100 rounded-0 text-start text-truncate btn ${
              activeChannelId === id ? 'btn-secondary' : ''
            }`}
          >
            <span className="me-1"># </span>
            {name}
          </Button>
          <Dropdown.Toggle
            split
            type="button"
            variant="white"
            id="channel-button-right"
            data-changecolour="hover"
            className={`flex-grow-0 btn ${activeChannelId === id ? 'btn-secondary' : ''}`}
          >
            <span className="visually-hidden">{t('modals.channelManagement')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => showModal('removing', { id })}>{t('channels.dropdownToggle.delete')}</Dropdown.Item>
            <Dropdown.Item onClick={() => showModal('renaming', { id, name, removable })}>{t('channels.dropdownToggle.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav.Item>
    ) : (
      <Nav.Item className="w-100" key={id} data-changecolour="hover">
        <Button
          onClick={() => handleClick(id)}
          type="button"
          variant="white"
          id="channel-button"
          data-changecolour="hover"
          className={`w-100 rounded-0 text-start btn ${
            activeChannelId === id ? 'btn-secondary' : ''
          }`}
        >
          <span className="me-1">#</span>
          {name}
        </Button>
      </Nav.Item>
    )
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels.allChannels);
  const activeChannelId = useSelector((state) => state.channels.currentActiveId);

  const showModal = (type, item = null) => dispatch(onShow({ type, item }));

  const handleClick = (id) => dispatch(setActiveChannel(id));

  return (
    <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex" id="channels-col">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <button
          onClick={() => showModal('adding')}
          type="button"
          id="channels-image-plus"
          className="p-0 text-primary btn btn-group-vertical"
        >
          <PlusSquareFill size={25} />
          <span className="visually-hidden">{t('modals.addModal.add')}</span>
        </button>
      </div>
      <Nav
        variant="pills"
        fill
        id="channels-box"
        className="flex-column px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels && channels.map((channel) => (
          <RenderChannel
            key={channel.id}
            channel={channel}
            handleClick={handleClick}
            showModal={showModal}
            activeChannelId={activeChannelId}
          />
        ))}
      </Nav>
    </Col>
  );
};

export default Channels;
