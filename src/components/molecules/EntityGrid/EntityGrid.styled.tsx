import styled from 'styled-components';

import Colors from '@styles/Colors';

export const StyledEntityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  margin-top: 20px;
`;

export const ItemWrapper = styled.div`
  display: flex;

  padding: 20px;
  border: 1px solid transparent;
  border-radius: 4px;

  background: ${Colors.slate800};

  cursor: pointer;
  transition: 0.3s;

  &:hover {
    border: 1px solid ${Colors.indigo400};

    background: ${Colors.slate850};
  }
`;

export const DetailsWrapper = styled.div`
  overflow: hidden;

  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;

  margin-left: 15px;
  width: 100%;
`;

export const ItemRow = styled.div<{$flex: number}>`
  display: flex;
  align-items: center;
  flex: ${({$flex}) => $flex};
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const ItemColumn = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledMetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-basis: 115px;

  padding-top: 5px;
`;
