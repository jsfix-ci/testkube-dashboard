import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import { TestResults, TestsFilter, TestsSummary } from '@organisms';
import { TestsContext } from '@context/testsContext';

import { useFetchTestsWithPagination } from '@hooks';
import { Modal } from '@atoms';

import { config } from '@constants/config';
import {
  isHostProtocolSecure,
  showSmallError,
  filterTestsExecution,
  cleanStorageWhenApiEndpointQueryStringIsAbsent,
  getApiEndpointOnPageLoad,
  CheckIfQueryParamsExistsInUrl,
} from '@utils';

import { SelectedTest } from '@types';

const MainTableStyles = styled.table`
  table-layout: fixed;
  width: 90vw;
  height: 100vh;
  text-align: center;
  margin: 0 auto;
`;

const StyledTestResults = styled.tr`
  display: flex;
  height: 140px;
  border-top-style: none;
  border-bottom-style: 1px solid var(--color-gray-secondary);
  word-wrap: break-word;
`;

const StyledTestFilter = styled.tr`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-right-style: hidden;
  border-left-style: hidden;
  height: 70px;
`;

const StyledTestSummary = styled.tr`
  border-top-style: hidden;
  height: 80vh;
  display: flex;
`;

function App() {
  const [filters, setFilters] = useState<any>({ filter: [], dateFilter: '' });
  const [visible, setVisible] = useState<boolean>(false);
  const [filterByDate, setFilterByDate] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<SelectedTest>({ id: '', testName: '' });
 

  const {
    fetchNextPage,
    hasNextPage,
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
    hasPreviousPage,
    isLoading,
    isSuccess,
  } = useFetchTestsWithPagination(filterByDate);


  const tests = {
    error,
    isLoading,
    selectedTest,
    setSelectedTest,
    setFilters,
    filters,
    filterByDate,
    setFilterByDate,
    testsExecution: filterTestsExecution(data, filters),
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
    hasPreviousPage,
    status,
    tests: { testExecutions: data },
    fetchNextPage,
    hasNextPage,
    isSuccess,
  };



  const dashboardEndpointValidators = () => {
    getApiEndpointOnPageLoad();
    cleanStorageWhenApiEndpointQueryStringIsAbsent();

    if (!isHostProtocolSecure()) {
      showSmallError(`Dashboard is using non-secure protocol!
      <a href='https://kubeshop.github.io/testkube/dashboard/#httpstls-configuration' target="_blank" rel="noopener">Read more</a>`);
    }
    const apiEndpointExist = CheckIfQueryParamsExistsInUrl(config.apiEndpoint);
    if (!apiEndpointExist) {
      setVisible(true);
    }
  };

  useEffect(() => {
    dashboardEndpointValidators();
  }, []);

  const RenderApp = React.useCallback(() => {
    return (
      <MainTableStyles>
        <thead>
          <StyledTestResults>
            <TestResults />
          </StyledTestResults>
        </thead>
        <tbody>
          <StyledTestFilter>
            <TestsFilter />
          </StyledTestFilter>
          <StyledTestSummary>
            <TestsSummary />
          </StyledTestSummary>
        </tbody>
      </MainTableStyles>
    );
  }, []);

  return (
    <>
      {visible && <Modal visible isModalVisible={setVisible} />}
      <TestsContext.Provider value={tests}>
        <Switch>
          <Route path="/?apiEndpoint=:apiEndpoint" exact render={RenderApp} />
          <Route path="/" exact component={RenderApp} />
        </Switch>
      </TestsContext.Provider>
    </>
  );
}

export default App;
