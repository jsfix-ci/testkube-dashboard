import React, {useContext, useEffect, useState} from 'react';

import {Modal} from 'antd';

import axios from 'axios';
import styled from 'styled-components';

import {config} from '@constants/config';

import {setApiEndpoint} from '@redux/reducers/configSlice';

import {Button, Input, Text} from '@custom-antd';

import {MainContext} from '@contexts';

import env from '../../../env';

const StyledSearchUrlForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const modalBodyStyles = {
  backgroundColor: 'var(--color-dark-primary)',
  overflow: 'hidden',
};

const StyledFormContainer = styled.div`
  display: flex;
  align-items: center;

  margin-top: 10px;

  input {
    margin-right: 15px;
  }
`;

type ModalProps = {
  isModalVisible: (isVisible: boolean) => void;
  visible?: boolean;
};

axios.defaults.baseURL = localStorage.getItem('apiEndpoint') || env?.apiUrl || `${window.location.origin}/results/v1`;

const CustomModal: React.FC<ModalProps> = props => {
  const {isModalVisible, visible} = props;

  const defaultApiEndpoint =
    localStorage.getItem('apiEndpoint') || env?.apiUrl || `${window.location.origin}/results/v1`;

  const {dispatch} = useContext(MainContext);

  const [apiEndpoint, setApiEndpointHook] = useState(defaultApiEndpoint);

  const handleOpenUrl = (event: React.FormEvent) => {
    event.preventDefault();

    axios.defaults.baseURL = apiEndpoint;

    localStorage.setItem(config.apiEndpoint, apiEndpoint);

    isModalVisible(false);

    dispatch(setApiEndpoint(apiEndpoint));
  };

  const handleCancel = () => {
    isModalVisible(false);
  };

  useEffect(() => {
    dispatch(setApiEndpoint(defaultApiEndpoint));

    localStorage.setItem('apiEndpoint', defaultApiEndpoint);
  }, []);

  return (
    <>
      <Modal
        title="TestKube API endpoint"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        bodyStyle={modalBodyStyles}
      >
        <StyledSearchUrlForm onSubmit={handleOpenUrl} data-cy="modal-api-endpoint">
          <Text>
            Please provide the TestKube API endpoint for your installation, which will have been provided to you by the
            TestKube installer -{' '}
            <a
              href="https://kubeshop.github.io/testkube/UI/#ui-results-endpoint"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More...
            </a>
          </Text>
          <Text>
            The endpoint needs to be accessible from your browser and will be used to retrieve test results only.
          </Text>
          <StyledFormContainer>
            <Input
              id="url"
              name="url"
              onChange={event => {
                setApiEndpointHook(event.target.value);
              }}
              defaultValue={apiEndpoint}
            />
            <Button type="primary" htmlType="submit">
              Get results
            </Button>
          </StyledFormContainer>
        </StyledSearchUrlForm>
      </Modal>
    </>
  );
};

export default CustomModal;
