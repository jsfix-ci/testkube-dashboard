import React, {useState} from 'react';
import {DatePicker} from 'antd';
import styled from 'styled-components';

import {Typography, Button} from '@atoms';

import {TestsContext} from '@context/testsContext';

const StyledDateContainer = styled.div`
  display: flex;
  align-items: baseline;

  & > * {
    flex: 1 1 auto;
    margin: 5px;
  }
`;

const datePickerStyles = {
  color: 'var(--color-light-primary)',
  backgroundColor: 'var(--color-dark-primary)',
  borderLeft: 'none',
  borderTop: 'none',
  borderRight: 'none',
  borderBottom: '1px solid var(--color-light-primary)',
};

const ResultDatePicker = () => {
  const [latestDate, setLatestDate] = useState<boolean>(false);
  const [toggleGetTest, setToggleGetTest] = useState<boolean>(false);
  const tests: any = React.useContext(TestsContext);

  const handleDatePicker = (date: any, dateString: any) => {
    tests.setSelectedTimeIntervalTests(dateString);
  };

  const getLatestDateTest = React.useCallback(() => {
    tests.setLatestDateTests(!latestDate);
    setLatestDate(!latestDate);
  }, [latestDate]);

  React.useEffect(() => {
    if (tests.data) {
      setToggleGetTest(true);
    }
  }, [tests.data]);

  return (
    <StyledDateContainer>
      <Typography variant="quaternary">Results for</Typography>
      <DatePicker size="large" style={datePickerStyles} onChange={handleDatePicker} />
      <Button disabled={!toggleGetTest} onClick={getLatestDateTest}>
        Latest
      </Button>
    </StyledDateContainer>
  );
};

export default ResultDatePicker;
