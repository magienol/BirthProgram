import React from 'react';
import {
  Modal,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
} from '@dhis2/ui';
import moh from '../images/moh.png';
import QRCode from 'react-qr-code';

const DataView = ({ isOpen, onClose, eventData }) => {
  if (!eventData) return null;

  const handleClose = () => onClose?.();
  const handlePrint = () => window.print();

  const getDataValue = (dataElementId) => {
    const dataValue = eventData.dataValues?.find(dv => dv.dataElement === dataElementId);
    return dataValue ? dataValue.value : '-';
  };

  const formatDate = (dateStr) =>
    dateStr && dateStr !== '-' ? new Date(dateStr).toLocaleDateString() : '-';

  const childName = getDataValue('ZVlvCTT6G4A');
  const sex = getDataValue('cJ1lAdSRdOn');
  const dob = formatDate(getDataValue('FQTIz54NLN4'));
  const timeOfBirth = getDataValue('yxqZmHDnCWf');
  const motherFullName = getDataValue('J9i1DFTGnpb');
  const motherNationality = getDataValue('Ej58X2a6ZBA');
  const motherState = getDataValue('t8g5g9jtk84');
  const motherCounty = getDataValue('RvYMn4U8sVo');
  const motherPayam = getDataValue('UCrKivG7NBR');
  const motherBoma = getDataValue('WCKiK2E56ML');

  const fatherFullName = getDataValue('uh1CxrbOqfW');
  const fatherNationality = getDataValue('sn6kx28cLYb');
  const fatherState = getDataValue('G9iUp4gocu9');
  const fatherCounty = getDataValue('iavApfZQmht');
  const fatherPayam = getDataValue('rZG3YsDjzBJ');
  const fatherBoma = getDataValue('g0nf4TliiBp');

  const notifierNameInFull = getDataValue('QXjGgP1OGrP');
  const notifierOccupation = getDataValue('Fe9NLNTucAU');
  const midwifename = getDataValue('OCI82CIDA6X');
  const midwifeDate = getDataValue('OLQWApHJ81N');
  const CeritifcateNo = getDataValue('IUjYj4e02QZ');
  const facility = eventData.orgUnitName || eventData.orgUnit || '-';

  const qrData = {
    childName,
    sex,
    dob,
    motherFullName,
    motherNationality,
    fatherFullName,
    fatherNationality,
    facility,
    certificateVerifiedUrl: 'https://dev.southsudanhis.org',
  };

  const renderNationality = (value) => {
    if (!value || value === '-') return '-';
    const words = value.split(' ');
    if (words.length >= 2) {
      return (
        <>
          {words[0]}<br />{words.slice(1).join(' ')}
        </>
      );
    }
    return value;
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A5 portrait;
              margin: 10mm;
            }

            body * {
              visibility: hidden;
            }

            #print-area, #print-area * {
              visibility: visible;
            }

            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }

            .certificate-container {
              width: 100%;
              max-width: 148mm;
              font-size: 10pt;
              background: white;
              padding: 10mm;
              box-sizing: border-box;
            }

            .certificate-table td {
              font-size: 9pt;
              padding: 4px 6px;
              border: 1px solid #ccc;
            }

            .certificate-footer {
              font-size: 8pt;
              text-align: center;
              margin-top: 8mm;
            }

            .qr-container {
              text-align: center;
              margin-top: 10mm;
            }

            .dhis2-ui-modal,
            .dhis2-ui-modal__scrim {
              display: none !important;
            }
          }

          .certificate-container {
            width: 100%;
            max-width: 148mm;
            margin: 0 auto;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: white;
          }

          .certificate-header {
            text-align: center;
            margin-bottom: 15px;
          }

          .certificate-logo {
            display: block;
            margin: 10px auto 0;
            width: 70px;
          }

          .certificate-table {
            width: 100%;
            border-collapse: collapse;
          }

          .certificate-table td {
            padding: 4px;
            border: 1px solid #ccc;
          }

          .qr-container {
            margin-top: 15px;
            text-align: center;
          }

          .certificate-footer {
            margin-top: 10px;
            font-size: 9pt;
            text-align: center;
          }
        `}
      </style>

      <Modal position="middle" hide={!isOpen} onClose={handleClose}>
        <ModalContent style={{ maxHeight: 'none', overflow: 'visible' }}>
          <div id="print-area">
            <div className="certificate-container">
              <div className="certificate-header">
                <h1 style={{ fontSize: '16pt', margin: '0' }}>Republic of South Sudan</h1>
                <h2 style={{ fontSize: '14pt', margin: '0' }}>Ministry of Health</h2>
                <h3 style={{ fontSize: '12pt', margin: '10px 0' }}>Birth Notification Certificate</h3>
                <img src={moh} alt="Ministry of Health" className="certificate-logo" />
              </div>

              <table className="certificate-table">
                <tbody>
                  <tr>
                    <td><strong>Notification No:</strong></td>
                    <td>{CeritifcateNo}</td>
                    <td><strong>Date of Birth:</strong></td>
                    <td>{dob}</td>
                  </tr>
                  <tr>
                    <td><strong>Facility:</strong></td>
                    <td>{facility}</td>
                    <td><strong>Child Name:</strong></td>
                    <td>{childName}</td>
                  </tr>
                  <tr>
                    <td><strong>Sex:</strong></td>
                    <td>{sex}</td>
                    <td><strong>Time of Birth:</strong></td>
                    <td>{timeOfBirth}</td>
                  </tr>

                  <tr>
                    <td colSpan="4" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Mother:</td>
                  </tr>
                  <tr>
                    <td><strong>Mother Name:</strong></td>
                    <td>{motherFullName}</td>
                    <td><strong>Mother Nationality:</strong></td>
                    <td>{renderNationality(motherNationality)}</td>
                  </tr>
                  <tr>
                    <td><strong>Mother State:</strong></td>
                    <td>{motherState}</td>
                    <td><strong>Mother County:</strong></td>
                    <td>{motherCounty}</td>
                  </tr>
                  <tr>
                    <td><strong>Mother Payam:</strong></td>
                    <td>{motherPayam}</td>
                    <td><strong>Mother Boma:</strong></td>
                    <td>{motherBoma}</td>
                  </tr>

                  <tr>
                    <td colSpan="4" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Father:</td>
                  </tr>
                  <tr>
                    <td><strong>Father Name:</strong></td>
                    <td>{fatherFullName}</td>
                    <td><strong>Father Nationality:</strong></td>
                    <td>{fatherNationality}</td>
                  </tr>
                  <tr>
                    <td><strong>Father State:</strong></td>
                    <td>{fatherState}</td>
                    <td><strong>Father County:</strong></td>
                    <td>{fatherCounty}</td>
                  </tr>
                  <tr>
                    <td><strong>Father Payam:</strong></td>
                    <td>{fatherPayam}</td>
                    <td><strong>Father Boma:</strong></td>
                    <td>{fatherBoma}</td>
                  </tr>

                  <tr>
                    <td colSpan="4" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Informant / Notifier:</td>
                  </tr>
                  <tr>
                    <td><strong>Name and Surname:</strong></td>
                    <td>{notifierNameInFull}</td>
                    <td><strong>Occupation:</strong></td>
                    <td>{notifierOccupation}</td>
                  </tr>

                  <tr>
                    <td colSpan="4" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Clerk / Midwife:</td>
                  </tr>
                  <tr>
                    <td><strong>Name and Surname:</strong></td>
                    <td>{midwifename}</td>
                    <td><strong>Date:</strong></td>
                    <td>{midwifeDate}</td>
                  </tr>
                </tbody>
              </table>

              <div className="qr-container">
                <QRCode value={JSON.stringify(qrData)} size={80} fgColor="#000000" />
              </div>

              <div className="certificate-footer">
                This Birth Notification is system-generated and does not require a signature.<br />
                You can verify the certificate by scanning the QR code.
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalActions>
          <ButtonStrip>
            <Button onClick={handlePrint} primary>Print</Button>
            <Button onClick={handleClose} destructive>Close</Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    </>
  );
};

export default DataView;
