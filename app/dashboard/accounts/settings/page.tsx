'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Save,
  Bell,
  CreditCard,
  DollarSign,
  Shield,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Building2
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

export default function AccountsSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'ABC International School',
    currency: 'INR',
    fiscalYearStart: 'April',
    fiscalYearEnd: 'March',
    taxId: 'TAX-2024-001',
    accountNumber: 'ACC-2024-001',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234'
  });

  // Fee Settings
  const [feeSettings, setFeeSettings] = useState({
    autoGenerateInvoices: true,
    invoiceDueDays: 15,
    lateFeeEnabled: true,
    lateFeePercentage: 2.5,
    paymentReminderDays: [7, 3, 1],
    allowPartialPayments: true,
    minimumPaymentAmount: 1000
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    paymentReceived: true,
    paymentPending: true,
    invoiceGenerated: true,
    paymentReminder: true,
    reportGenerated: false,
    lowBalanceAlert: true,
    balanceThreshold: 50000
  });

  // Payment Methods
  const paymentMethods = [
    { id: 1, name: 'Online Transfer', enabled: true, fee: 0 },
    { id: 2, name: 'Cash', enabled: true, fee: 0 },
    { id: 3, name: 'Cheque', enabled: true, fee: 0 },
    { id: 4, name: 'Credit Card', enabled: false, fee: 2.5 },
    { id: 5, name: 'Debit Card', enabled: false, fee: 1.5 },
    { id: 6, name: 'UPI', enabled: true, fee: 0 }
  ];

  const [paymentMethodsList, setPaymentMethodsList] = useState(paymentMethods);

  const tabs = [
    { id: 'general', label: 'General', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100', from: 'from-blue-400/30', to: 'to-blue-400/0' },
    { id: 'fees', label: 'Fee Settings', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', from: 'from-emerald-400/30', to: 'to-emerald-400/0' },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-100', from: 'from-violet-400/30', to: 'to-violet-400/0' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-100', from: 'from-amber-400/30', to: 'to-amber-400/0' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-rose-600', bg: 'bg-rose-100', from: 'from-rose-400/30', to: 'to-rose-400/0' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    console.log('Settings saved');
  };

  const togglePaymentMethod = (id: number) => {
    setPaymentMethodsList(prev =>
      prev.map(method =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative z-10 min-h-screen px-6 py-12 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Premium Consolidated Header */}
          <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
              <div className="relative p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard/accounts"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 transition-all shadow-sm"
                    >
                      <ArrowLeft size={18} />
                    </Link>
                    <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />
                    <div className="rounded-lg bg-gradient-to-br from-slate-400/30 to-slate-400/0 p-2.5">
                      <Settings className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Account Settings</h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your account preferences and configurations.</p>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium shadow-sm transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Settings</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:w-72">
              <div className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/60 dark:bg-slate-900/60 shadow-lg backdrop-blur-md p-4 space-y-2 sticky top-6">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all",
                        isActive ? "bg-white dark:bg-slate-800 shadow-md border border-slate-100/50 dark:border-slate-700/50" : "hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm"
                      )}
                    >
                      <div className={clsx("h-9 w-9 rounded-xl flex items-center justify-center",
                        isActive ? `bg-gradient-to-br ${tab.from} ${tab.to} border border-white/50` : "bg-slate-100 dark:bg-slate-700"
                      )}>
                        <IconComponent className={clsx("h-5 w-5", isActive ? tab.color : "text-slate-500 dark:text-slate-400")} />
                      </div>
                      <span className={clsx("font-semibold text-sm", isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <div className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 min-h-[500px]">

                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Information</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Basic school details and preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">School Name</label>
                        <input
                          type="text"
                          value={generalSettings.schoolName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, schoolName: e.target.value })}
                          disabled={!isEditing}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tax ID</label>
                        <input
                          type="text"
                          value={generalSettings.taxId}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, taxId: e.target.value })}
                          disabled={!isEditing}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currency</label>
                        <select
                          value={generalSettings.currency}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                          disabled={!isEditing}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none dark:text-white"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fiscal Year Start</label>
                        <select
                          value={generalSettings.fiscalYearStart}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, fiscalYearStart: e.target.value })}
                          disabled={!isEditing}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none dark:text-white"
                        >
                          <option value="January">January</option>
                          <option value="April">April</option>
                          <option value="July">July</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Bank Account Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Number</label>
                          <input
                            type="text"
                            value={generalSettings.accountNumber}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, accountNumber: e.target.value })}
                            disabled={!isEditing}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bank Name</label>
                          <input
                            type="text"
                            value={generalSettings.bankName}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, bankName: e.target.value })}
                            disabled={!isEditing}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">IFSC Code</label>
                          <input
                            type="text"
                            value={generalSettings.ifscCode}
                            onChange={(e) => setGeneralSettings({ ...generalSettings, ifscCode: e.target.value })}
                            disabled={!isEditing}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee Settings */}
                {activeTab === 'fees' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fee Configuration</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure invoicing, late fees, and payments.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Auto-generate Invoices</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Automatically generate invoices for students based on plan.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feeSettings.autoGenerateInvoices}
                          onChange={(e) => setFeeSettings({ ...feeSettings, autoGenerateInvoices: e.target.checked })}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Invoice Due Days</label>
                        <input
                          type="number"
                          value={feeSettings.invoiceDueDays}
                          onChange={(e) => setFeeSettings({ ...feeSettings, invoiceDueDays: parseInt(e.target.value) })}
                          disabled={!isEditing}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Late Fee Percentage (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={feeSettings.lateFeePercentage}
                          onChange={(e) => setFeeSettings({ ...feeSettings, lateFeePercentage: parseFloat(e.target.value) })}
                          disabled={!isEditing || !feeSettings.lateFeeEnabled}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/30 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Enable Late Fees</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Charge late fees automatically for overdue payments.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feeSettings.lateFeeEnabled}
                          onChange={(e) => setFeeSettings({ ...feeSettings, lateFeeEnabled: e.target.checked })}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                {activeTab === 'payments' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Methods</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage accepted payment modes.</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Method
                      </button>
                    </div>

                    <div className="space-y-3">
                      {paymentMethodsList.map((method) => (
                        <div key={method.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">{method.name}</h4>
                              {method.fee > 0 && <span className="text-xs text-slate-400">Transaction fee: {method.fee}%</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={method.enabled}
                                onChange={() => togglePaymentMethod(method.id)}
                                disabled={!isEditing}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                            {isEditing && (
                              <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage email and system alerts.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive crucial updates via email.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    {notificationSettings.emailNotifications && (
                      <div className="grid gap-4 pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                        {[
                          { key: 'paymentReceived', label: 'Payment Received', desc: 'Notify when a payment is received' },
                          { key: 'paymentPending', label: 'Payment Pending', desc: 'Notify about pending payments' },
                          { key: 'invoiceGenerated', label: 'Invoice Generated', desc: 'Notify when invoices are generated' },
                          { key: 'lowBalanceAlert', label: 'Low Balance Alert', desc: 'Alert when balance is low' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-white">{item.label}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                                disabled={!isEditing}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage account security settings.</p>
                    </div>

                    <div className="grid gap-6">
                      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Change Password</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Update your password regularly to keep your account secure.</p>
                        <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          Update Password
                        </button>
                      </div>
                      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add an extra layer of security to your account.</p>
                        <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
