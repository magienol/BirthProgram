import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Card
} from '@dhis2/ui';

// Helper to format date to DD-MM-YYYY
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
};

const PeriodButton = ({ onSave, isOrgUnitSelected }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentDate = new Date().toISOString().split('T')[0];

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        if (startDate && endDate) {
            const period = { startDate, endDate };
            setSelectedPeriod(period);
            if (onSave) {
                onSave(period);
            }
        }
        handleCloseModal();
    };

    return (
        <div style={{ margin: '16px 0' }}>
            <Button
                onClick={handleOpenModal}
                disabled={!isOrgUnitSelected}
                secondary
            >
                {selectedPeriod
                    ? `${formatDate(selectedPeriod.startDate)} to ${formatDate(selectedPeriod.endDate)}`
                    : 'Select Period'}
            </Button>

            {isModalOpen && (
                <Modal position="middle">
                    <ModalTitle>Select Period</ModalTitle>
                    <ModalContent>
                        <Card>
                            <div style={{ padding: '16px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <label htmlFor="startDate">Start Date:</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        max={currentDate}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label htmlFor="endDate">End Date:</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        max={currentDate}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={handleCloseModal} secondary>Cancel</Button>
                            <Button onClick={handleSave} primary>Save</Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </div>
    );
};

export default PeriodButton;
