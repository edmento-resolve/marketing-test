"use client";

import React from 'react';
import { X, Printer, Download } from 'lucide-react';

export interface InvoiceItem {
    description: string;
    period: string;
    amount: number;
}

export interface TransactionData {
    transactionId: string;
    date: string;
    studentName: string;
    studentClass: string;
    admissionNo: string;
    items: InvoiceItem[];
    amount: number;
    discount?: number;
    paymentMode: string;
    reference?: string;
}

interface PaymentInvoiceProps {
    isOpen: boolean;
    onClose: () => void;
    data: TransactionData | null;
}

export const PaymentInvoice: React.FC<PaymentInvoiceProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const subtotal = data.amount + (data.discount || 0);

    return (
        <div id="printable-invoice-root" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-300">
            <div id="printable-invoice" className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col max-h-[95vh] relative active:scale-[0.99] transition-transform">

                {/* Header - Solid Blue */}
                <div className="bg-[#4F64AD] p-8 md:p-10 text-white relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors print:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="grid grid-cols-3 gap-1">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                    ))}
                                </div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Silver Oak</h1>
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70">International School</p>
                        </div>

                        <div className="text-left md:text-right space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-widest">Contact</h3>
                            <p className="text-[10px] text-white/80 leading-relaxed">
                                Avenue 878 MCG 5678 US<br />
                                Call +91 99887 76655<br />
                                admin@silveroak.edu.in
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub-header - Grey with Rounded Bottom */}
                <div className="bg-[#F8F9FD] px-10 py-8 relative -mt-4 rounded-b-[3rem] shadow-sm z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Invoice To</p>
                            <h2 className="text-sm font-black text-[#2D3A63] mb-1">{data.studentName}</h2>
                            <p className="text-[11px] font-bold text-slate-500 uppercase">{data.studentClass}</p>
                            <p className="text-[11px] text-slate-400">ID: {data.admissionNo}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Invoice Date</p>
                            <h2 className="text-sm font-black text-[#2D3A63]">{data.date.split(',')[0]}</h2>
                            <p className="text-[11px] text-slate-400">Time: {data.date.split(',')[1]?.trim()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Receipt No</p>
                            <h2 className="text-sm font-black text-[#2D3A63]">{data.transactionId}</h2>
                            <p className="text-[11px] text-rose-500 font-bold uppercase tracking-tight">Official Payment Record</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Content - Scrollable */}
                <div className="p-10 flex-1 overflow-y-auto custom-scrollbar bg-white pt-12">

                    <div className="space-y-8">
                        {/* Table */}
                        <div className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#EAEFFD]/50 rounded-xl">
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left w-12">No.</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Item Description</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Price</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Qty.</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.items.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="px-4 py-5 text-sm text-slate-400 font-medium">{String(idx + 1).padStart(2, '0')}.</td>
                                            <td className="px-4 py-5">
                                                <p className="text-sm font-black text-[#2D3A63]">{item.description}</p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.period}</p>
                                            </td>
                                            <td className="px-4 py-5 text-sm font-bold text-slate-600 text-center">₹{item.amount.toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-5 text-sm font-bold text-slate-600 text-center">01</td>
                                            <td className="px-4 py-5 text-sm font-black text-[#2D3A63] text-right">₹{item.amount.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                            {/* Left Column */}
                            <div className="space-y-10">
                                <div className="bg-[#F8F9FD] p-6 rounded-2xl border border-slate-100">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Method</h3>
                                    <div className="grid grid-cols-[80px_1fr] gap-y-1 text-[11px]">
                                        <span className="text-slate-400 font-bold uppercase">Mode:</span>
                                        <span className="text-[#2D3A63] font-bold uppercase">{data.paymentMode}</span>
                                        <span className="text-slate-400 font-bold uppercase">Ref No:</span>
                                        <span className="text-[#2D3A63] font-black">{data.reference || 'N/A'}</span>
                                        <span className="text-slate-400 font-bold uppercase">Status:</span>
                                        <span className="text-emerald-500 font-black uppercase">Paid In Full</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Terms & Conditions:</h3>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                        Fee once paid is non-refundable. Please keep this receipt safe for future reference. Electronic computer generated receipt, signature not required.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Totals */}
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="text-[#2D3A63] font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="text-rose-500 font-bold uppercase tracking-widest">Discount</span>
                                    <span className="text-rose-500 font-bold">-₹{(data.discount || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px] pb-4 border-b border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Tax (0%)</span>
                                    <span className="text-[#2D3A63] font-bold">₹0.00</span>
                                </div>

                                <div className="bg-[#4F64AD] p-5 rounded-2xl flex justify-between items-center text-white shadow-lg shadow-blue-200">
                                    <span className="text-xs font-black uppercase tracking-widest">Total</span>
                                    <span className="text-2xl font-black">₹{data.amount.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="pt-8 text-center border-t border-slate-100">
                                    <div className="h-0.5 w-32 bg-slate-100 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Authorised Sign</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="bg-[#4F64AD] py-3 px-10 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                    <p className="text-white text-[11px] font-bold italic tracking-wide">Thank you for your business</p>

                    <div className="flex items-center gap-3 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#4F64AD] text-[10px] font-black uppercase tracking-widest transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          /* Hide all page content by default */
          body * {
            visibility: hidden !important;
          }
          
          /* Make the invoice and all its children visible */
          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }
          
          /* Reset the root container for printing */
          #printable-invoice-root {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: transparent !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }

          /* Target the actual paper layout */
          #printable-invoice {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: visible !important;
          }

          /* Ensure scrollable sections expand */
          #printable-invoice .overflow-y-auto,
          #printable-invoice .flex-1 {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            display: block !important;
          }

          /* Force background colors and images */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Utility to hide elements specifically in print */
          .print-hidden {
            display: none !important;
          }

          /* Page setup */
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
        </div>
    );
};
