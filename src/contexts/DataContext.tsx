import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DataContextType {
  data: Record<string, any>[];
  headers: string[];
  types: Record<string, string>;
  setData: (data: Record<string, any>[]) => void;
  setHeaders: (headers: string[]) => void;
  setTypes: (types: Record<string, string>) => void;
}

export const DataContext = createContext<DataContextType>({
  data: [],
  headers: [],
  types: {},
  setData: () => {},
  setHeaders: () => {},
  setTypes: () => {},
});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [types, setTypes] = useState<Record<string, string>>({});

  return (
    <DataContext.Provider value={{ data, headers, types, setData, setHeaders, setTypes }}>
      {children}
    </DataContext.Provider>
  );
};
