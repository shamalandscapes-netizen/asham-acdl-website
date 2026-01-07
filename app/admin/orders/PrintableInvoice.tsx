'use client';

import React from 'react';

interface InvoiceProps {
  order: any;
  type?: 'invoice' | 'dispatch';
}

export default function PrintableInvoice({ order, type = 'invoice' }: InvoiceProps) {
  const isDispatch = type === 'dispatch';
  const isPaid = order.payment_status?.toLowerCase() === 'completed';

  return (
    <div className={`invoice-container print-only ${isDispatch ? 'dispatch-mode' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen { .print-only { display: none; } }
        @media print {
          .print-only { display: block !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .invoice-container { padding: 40px; background: white; font-family: 'Segoe UI', sans-serif; position: relative; }
        
        /* Official Stamps */
        .official-stamp {
          width: 120px; height: 120px;
          border: 3px double #06392F;
          border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; color: #06392F; opacity: 0.4;
          position: absolute; bottom: 80px; left: 40px;
          transform: rotate(-15deg);
        }

        .paid-stamp {
          position: absolute; top: 120px; right: 60px;
          border: 4px solid #27ae60; color: #27ae60;
          padding: 10px 20px; font-weight: 900; font-size: 24px;
          text-transform: uppercase; transform: rotate(15deg);
          border-radius: 8px; opacity: 0.7;
        }

        .inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; }
        .inv-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .inv-table th { background: #2c3e50; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
        .inv-table td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
        
        .footer-grid { display: grid; grid-template-cols: 1.5fr 1fr; gap: 40px; margin-top: 50px; }
        .signature-box { margin-top: 40px; border-top: 1px dashed #333; width: 100%; text-align: center; padding-top: 8px; font-size: 10px; }
      `}} />

      {/* Paid Stamp for Invoices */}
      {!isDispatch && isPaid && <div className="paid-stamp">PAID</div>}

      <div className="inv-header">
        <div className="company-info">
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#06392F' }}>ASHAM DESIGN</h1>
          <p style={{ fontSize: '12px', fontWeight: 600, margin: '2px 0' }}>CONSTRUCTION LIMITED</p>
          <p style={{ fontSize: '10px', color: '#666' }}>P.O.BOX 17 – 50103 KAKAMEGA | PIN: P051705048I</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '28px', color: isDispatch ? '#2c3e50' : '#e74c3c' }}>
            {isDispatch ? 'DISPATCH' : 'INVOICE'}
          </h2>
          <p style={{ fontSize: '11px', fontWeight: 'bold' }}>NO: {order.order_number}</p>
          <p style={{ fontSize: '11px' }}>DATE: {new Date(order.created_at).toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', margin: '0 0 5px 0' }}>
          {isDispatch ? 'Delivery Site & Consignee' : 'Bill To'}
        </h4>
        <p style={{ margin: 0, fontWeight: 900, fontSize: '15px' }}>{order.profiles?.full_name}</p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#444' }}>{order.delivery_address || 'Collection at Depot'}</p>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>{order.guest_phone || order.profiles?.phone}</p>
      </div>

      <table className="inv-table">
        <thead>
          <tr>
            <th>Material / Description</th>
            <th style={{ textAlign: 'center' }}>Qty</th>
            {!isDispatch && <th style={{ textAlign: 'right' }}>Unit Price</th>}
            {!isDispatch && <th style={{ textAlign: 'right' }}>Total (KES)</th>}
            {isDispatch && <th style={{ textAlign: 'right' }}>Verified (Initial)</th>}
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item: any) => (
            <tr key={item.id}>
              <td style={{ fontWeight: 600 }}>{item.products?.name}</td>
              <td style={{ textAlign: 'center', fontWeight: 900 }}>{item.quantity}</td>
              {!isDispatch && <td style={{ textAlign: 'right' }}>{item.unit_price.toLocaleString()}</td>}
              {!isDispatch && <td style={{ textAlign: 'right', fontWeight: 900 }}>{(item.quantity * item.unit_price).toLocaleString()}</td>}
              {isDispatch && <td style={{ textAlign: 'right', borderBottom: '1px solid #ddd' }}></td>}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer-grid">
        <div>
          <h4 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999' }}>Notes / Instructions</h4>
          <p style={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>
            {isDispatch 
              ? "All materials remain the property of Asham Construction until full payment is received. Please verify quantity before the driver leaves." 
              : `Thank you for choosing Asham Design Construction. Please reference ${order.order_number} in all communications.`}
          </p>
          
          {/* Official Stamp Circle */}
          <div className="official-stamp">
            <span style={{ fontSize: '8px', fontWeight: 'bold' }}>ASHAM ACDL</span>
            <span style={{ fontSize: '10px', fontWeight: 'black' }}>OFFICIAL</span>
            <span style={{ fontSize: '8px', fontWeight: 'bold' }}>STAMP</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isDispatch && (
            <div style={{ textAlign: 'right', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>TOTAL PAYABLE</span>
              <p style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>KES {order.total_amount.toLocaleString()}</p>
            </div>
          )}
          
          <div className="signature-box">
             <strong>{isDispatch ? 'CLIENT SIGNATURE & DATE' : 'AUTHORIZED SIGNATURE'}</strong>
          </div>
          
          {isDispatch && (
            <div className="signature-box" style={{ marginTop: '10px' }}>
               <strong>LOADER / DRIVER SIGNATURE</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}