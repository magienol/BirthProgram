import React, { useState } from 'react';
import {
    Button,
    OrganisationUnitTree,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Card,
    ButtonStrip,
    CircularLoader,
    NoticeBox
} from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';

const query = {
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName', 'path', 'children::isNotEmpty'],
            paging: false,
            level: 1
        }
    }
};

const OrgUnitSelector = ({ setOrgUnit, onOrgUnitSelected }) => {
    const { loading, error, data } = useDataQuery(query);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState([]);

    const handleOrgUnitSelect = (selected) => {
        console.log('Selected org unit:', selected); // Debug
        if (selected && selected.id && selected.path) {
            setSelectedOrgUnit({
                id: selected.id,
                displayName: selected.displayName,
                path: selected.path
            });
        }
    };

    const handleExpand = (orgUnit) => {
        setExpanded((prev) => [...prev, orgUnit.path]);
    };

    const handleCollapse = (orgUnit) => {
        setExpanded((prev) => prev.filter(path => path !== orgUnit.path));
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSave = () => {
        if (selectedOrgUnit) {
            setOrgUnit(selectedOrgUnit);
            if (onOrgUnitSelected) {
                onOrgUnitSelected();
            }
        }
        closeModal();
    };

    const rootOrgUnits = data?.orgUnits?.organisationUnits || [];

    return (
        <div>
            <Button onClick={openModal} primary>
                {selectedOrgUnit ? selectedOrgUnit.displayName : 'Select Organization Unit'}
            </Button>

            {isModalOpen && (
                <Modal position="middle">
                    <ModalTitle>Select Organization Unit</ModalTitle>
                    <ModalContent>
                        {loading && <CircularLoader />}
                        {error && <NoticeBox error>ERROR: {error.message}</NoticeBox>}
                        {rootOrgUnits.length > 0 ? (
                            <OrganisationUnitTree
                                name="Organization Units"
                                onChange={handleOrgUnitSelect}
                                onSelectClick={handleOrgUnitSelect}
                                roots={rootOrgUnits.map(ou => ou.id)}
                                selected={selectedOrgUnit ? [selectedOrgUnit.path] : []}
                                expanded={expanded}
                                handleExpand={handleExpand}
                                handleCollapse={handleCollapse}
                                hideCheckboxes={false}
                                hideMemberCount={false}
                            />
                        ) : (
                            <NoticeBox warning>No organization units found</NoticeBox>
                        )}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={closeModal} secondary>Cancel</Button>
                            <Button onClick={handleSave} primary>Save</Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {selectedOrgUnit && (
                <Card>
                    <div style={{ padding: '16px' }}>
                        <p>Selected Organization Unit: {selectedOrgUnit.displayName}</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default OrgUnitSelector;
