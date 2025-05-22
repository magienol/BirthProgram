import React, { useState, useCallback } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import {
  DataTable,
  DataTableHead,
  DataTableRow,
  DataTableColumnHeader,
  DataTableBody,
  DataTableCell,
  DataTableFoot,
  Pagination,
  Button,
  NoticeBox,
  CircularLoader,
  Card,
} from '@dhis2/ui';
import OrgUnitSelector from './OrgUnitSelector';
import PeriodButton from './PeriodButton';
import DataView from './DataView';

const programId = 'UxeePXLdng7';

const dataElements = [
  { id: 'ZVlvCTT6G4A', displayName: 'Name of the Child' },
  { id: 'cJ1lAdSRdOn', displayName: 'Sex' },
  { id: 'FQTIz54NLN4', displayName: 'Date of Birth' },
  { id: 'J9i1DFTGnpb', displayName: 'Mother Full Name' },
  { id: 'Ej58X2a6ZBA', displayName: 'Mother Nationality' },
  { id: 'uh1CxrbOqfW', displayName: 'Father Full Name' },
  { id: 'sn6kx28cLYb', displayName: 'Father Nationality' },
];

const eventsQuery = {
  events: {
    resource: 'events',
    params: ({ page, pageSize, orgUnitId, startDate, endDate, ouMode }) => ({
      program: programId,
      page,
      pageSize,
      totalPages: true,
      orgUnit: orgUnitId,
      ouMode,
      startDate,
      endDate,
      fields: 'event,eventDate,dataValues[dataElement,value],orgUnit,orgUnitName',
    }),
  },
};

const orgUnitInfoQuery = {
  orgUnitInfo: {
    resource: 'organisationUnits',
    id: ({ id }) => id,
    params: {
      fields: 'id,displayName,children[id]',
    },
  },
};

const GenerateReportButton = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orgUnit, setOrgUnit] = useState(null);
  const [period, setPeriod] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [isOrgUnitSelected, setIsOrgUnitSelected] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDataViewOpen, setIsDataViewOpen] = useState(false);

  const { loading, error, data, refetch } = useDataQuery(eventsQuery, { lazy: true });
  const { refetch: fetchOrgUnitInfo } = useDataQuery(orgUnitInfoQuery, { lazy: true });

  const fetchEvents = useCallback((page, size) => {
    if (!orgUnit || !period) return;

    refetch({
      page,
      pageSize: size,
      orgUnitId: orgUnit.id,
      ouMode: orgUnit.ouMode || 'SELECTED',
      startDate: period.startDate,
      endDate: period.endDate,
    });
  }, [orgUnit, period, refetch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    fetchEvents(page, pageSize);
  }, [fetchEvents, pageSize]);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchEvents(1, size);
  }, [fetchEvents]);

  const handleGenerateReport = () => {
    if (!orgUnit || !period) return;
    setShowTable(true);
    fetchEvents(currentPage, pageSize);
  };

  const onOrgUnitSelected = async (selectedOrgUnit) => {
    const result = await fetchOrgUnitInfo({ id: selectedOrgUnit.id });

    if (result?.orgUnitInfo?.children?.length > 0) {
      selectedOrgUnit.ouMode = 'DESCENDANTS';
    } else {
      selectedOrgUnit.ouMode = 'SELECTED';
    }

    setOrgUnit(selectedOrgUnit);
    setIsOrgUnitSelected(true);
  };

  const handlePeriodSave = (selectedPeriod) => {
    setPeriod(selectedPeriod);
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsDataViewOpen(true);
  };

  const closeDataView = () => {
    setIsDataViewOpen(false);
  };

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ marginRight: '20px' }}>
            <OrgUnitSelector setOrgUnit={onOrgUnitSelected} />
          </div>
          <div style={{ marginRight: '20px' }}>
            <PeriodButton onSave={handlePeriodSave} isOrgUnitSelected={isOrgUnitSelected} />
          </div>
          <Button
            onClick={handleGenerateReport}
            primary
            disabled={!orgUnit || !period}
          >
            Generate Report
          </Button>
        </div>

        {showTable && (
          <div>
            {loading && <CircularLoader />}
            {error && <NoticeBox error>ERROR: {error.message}</NoticeBox>}
            {data && !loading && (
              <div>
                <DataTable>
                  <DataTableHead>
                    <DataTableRow>
                      <DataTableColumnHeader>Event Date</DataTableColumnHeader>
                      <DataTableColumnHeader>Org Unit</DataTableColumnHeader>
                      {dataElements.map(de => (
                        <DataTableColumnHeader key={de.id}>{de.displayName}</DataTableColumnHeader>
                      ))}
                    </DataTableRow>
                  </DataTableHead>
                  <DataTableBody>
                    {data.events.events && data.events.events.length > 0 ? (
                      data.events.events.map((event) => (
                        <DataTableRow
                          key={event.event}
                          onClick={() => handleRowClick(event)}
                          style={{ cursor: 'pointer' }}
                        >
                          <DataTableCell>{new Date(event.eventDate).toLocaleDateString()}</DataTableCell>
                          <DataTableCell>{event.orgUnitName || event.orgUnit}</DataTableCell>
                          {dataElements.map(de => (
                            <DataTableCell key={de.id}>
                              {event.dataValues.find(dv => dv.dataElement === de.id)?.value || '-'}
                            </DataTableCell>
                          ))}
                        </DataTableRow>
                      ))
                    ) : (
                      <DataTableRow>
                        <DataTableCell colSpan={2 + dataElements.length}>No events found for the selected criteria</DataTableCell>
                      </DataTableRow>
                    )}
                  </DataTableBody>
                  <DataTableFoot>
                    <DataTableRow>
                      <DataTableCell colSpan={2 + dataElements.length}>Total Events: {data.events.pager?.total || 0}</DataTableCell>
                    </DataTableRow>
                  </DataTableFoot>
                </DataTable>
                {data.events.pager && (
                  <Pagination
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    page={currentPage}
                    pageCount={Math.ceil((data.events.pager?.total || 0) / pageSize)}
                    pageSize={pageSize}
                    total={data.events.pager?.total || 0}
                  />
                )}
              </div>
            )}
          </div>
        )}

        <DataView
          isOpen={isDataViewOpen}
          onClose={closeDataView}
          eventData={selectedEvent}
          dataElements={dataElements}
        />
      </div>
    </Card>
  );
};

export default GenerateReportButton;
